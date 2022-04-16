import {  MsalProviderPopupConfig, MsalProviderRedirectConfig } from '.';
import * as msal from '@azure/msal-browser';
import { ConfigType } from './msal-provider';
import { StringDict } from '@azure/msal-common';


export class MsalApp {

  private msalInstance : msal.PublicClientApplication;
  private config : MsalProviderPopupConfig | MsalProviderRedirectConfig;
  private usePopup : boolean;
  private homeAccountId : string |undefined;
  private isLoggedIn : boolean = false;
  private setLoginState: (isLoggedIn: boolean, authResult: msal.AuthenticationResult | undefined) => void = () => {
    //do nothing
  };

  
  public registerCallback = (callback:(isLoggedIn: boolean, authResult:msal.AuthenticationResult | undefined)=>void) => {
    this.setLoginState = callback;
  }

  get IsLoggedIn() : boolean{
    try {
      this.isLoggedIn = this.msalInstance.getAllAccounts().length > 0 ;
    } catch (err) {
      this.isLoggedIn = false;
      console.error("error getting logged in value",err);
    }
    console.log("getting logged in value:",this.isLoggedIn);
    return this.isLoggedIn;
  }

  get MsalInstance() : msal.PublicClientApplication{
    return this.msalInstance;
  }
  
  constructor(msalInstance : msal.PublicClientApplication, config : MsalProviderPopupConfig | MsalProviderRedirectConfig){
    this.msalInstance = msalInstance;
    this.config = config;
    this.usePopup = config.type === ConfigType.Popup;
  }
  
  /**
   *  Logs in the user interactively, call when you know the user is not already logged in.
   *  @param options object containing the following fields:
   * - `state`: optional - string to be passed back to the redirect uri after successful login.
   * - `params`: optional - additional parameters to be passed to the authorize endpoint - readable by AAD custom user journeys.
   */
  public async login(options?:{state?:string, params?:Map<string,string>}) : Promise<msal.AuthenticationResult | undefined> {
    
    let queryParams:StringDict = {};
    if(options && options.params){
      options.params.forEach((value,key)=>{
        queryParams[key] = value;
      });
    }

    let state = options?.state ?? "";
   
    if (this.usePopup) {
      var popupConfig = this.config as MsalProviderPopupConfig;
      popupConfig.loginRequestConfig!.extraQueryParameters = queryParams;
      popupConfig.loginRequestConfig!.state = state;
      return this.loginPopup(popupConfig.loginRequestConfig);
    } else {
      var redirectConfig = this.config as MsalProviderRedirectConfig;
      redirectConfig.redirectRequestConfig!.extraQueryParameters = queryParams;
      redirectConfig.redirectRequestConfig!.state = state;
      await this.loginRedirect(redirectConfig?.redirectRequestConfig);
      return undefined;
    }
  }

  private async loginPopup(
    loginRequestConfig?: msal.PopupRequest
  )  : Promise<msal.AuthenticationResult | undefined> {
    try {
      const loginResponse = await this.msalInstance.loginPopup(loginRequestConfig);
      this.homeAccountId = loginResponse.account?.homeAccountId;
      return await this.getAuthResult();
    } catch (err) {
      console.error("loginPopup error", err);
      this.isLoggedIn = false;
      this.setLoginState(false,undefined);
      return undefined;
    }
  }

  public async loginRedirect (
    redirectRequestConfig?: msal.RedirectRequest | undefined
  )  {
    try {
      await this.msalInstance.loginRedirect(redirectRequestConfig);
    } catch (err) {
      console.error("loginRedirect error",err);
      // handle error
    }
  }

  public async handleRedirectResult (
    authResult: msal.AuthenticationResult | null
  )  {
    console.log("handle redirect result got:",authResult);
    if(authResult){
      this.isLoggedIn = true;
      this.setLoginState(true,authResult);
    }
    else {
      authResult = (await this.getAuthResult()) ?? null;
      console.log("handleRedirectResult, no auth so tried again and got: ",authResult);
      if(authResult){
        this.isLoggedIn = true;
        this.setLoginState(true,authResult);
      }else {
        this.isLoggedIn = false;
        this.setLoginState(false,undefined);
      }
    }
   
    /*

    if (!authResult && authResult !== null) {
      //may be called from loginTokenPopup or on a page load
      authResult = (await this.getAuthResult()) ?? null;
    }
    if (
        (
          authResult !== null &&
          authResult.account !== null &&
          authResult.account?.homeAccountId !== this.homeAccountId
        )
      ){
    */
     // this.homeAccountId = authResult.account?.homeAccountId;
     // this.getAuthResult(authResult.account?.homeAccountId);
    //} 
  }

  private getAccount (
    providedHomeAccountId?: string
  ): msal.AccountInfo | undefined  {
    let usedHomeAccountId = providedHomeAccountId ?? this.homeAccountId;
    if (!usedHomeAccountId) return this.msalInstance.getAllAccounts()[0];
    return this.msalInstance.getAccountByHomeId(usedHomeAccountId) ?? undefined;
  }

  private getFullSilentRequestConfig  (
    silentRequestConfig: msal.SilentRequest,
    providedHomeAccountId?: string
  ): msal.SilentRequest | undefined  {
    let account = this.getAccount(providedHomeAccountId) ?? ({} as msal.AccountInfo);
    if (typeof account === "undefined") return undefined;
    return {
      account,
      ...silentRequestConfig,
    } as msal.SilentRequest;
  }

  public async getAuthToken  (
    providedHomeAccountId?: string
  ): Promise<string | undefined> {
    return (await this.getAuthResult(providedHomeAccountId))?.accessToken;
  }

  private getAuthResults(
    providedHomeAccountId?: string,
    isSilent:boolean=false
  ): Promise<msal.AuthenticationResult | undefined>  {

    var fullSilentRequestConfig = this.getFullSilentRequestConfig(
      this.config.silentRequestConfig,
      providedHomeAccountId
    );

    if (!fullSilentRequestConfig) {
      this.isLoggedIn = false;
      return Promise.resolve(undefined);
    }

    if (this.usePopup) {
      var popupConfig = this.config as MsalProviderPopupConfig;
      return this.authTokenPopup(
        fullSilentRequestConfig,
        popupConfig.loginRequestConfig,
        true
      );
    } else {
      var redirectConfig = this.config as MsalProviderRedirectConfig;
      return this.authTokenRedirect(
        fullSilentRequestConfig,
        redirectConfig?.redirectRequestConfig,
        true
      );
    }
  }

  public async getAuthResult  (
    providedHomeAccountId?: string
  ): Promise<msal.AuthenticationResult | undefined>  {
    return this.getAuthResults(providedHomeAccountId);
  }

  public async getSilentAuthResult  (
    providedHomeAccountId?: string
  ): Promise<msal.AuthenticationResult | undefined>  {
    return this.getAuthResults(providedHomeAccountId, true);
  }

  private async authTokenPopup  (
    silentRequest: msal.SilentRequest,
    loginRequestConfig?: msal.PopupRequest | undefined,
    isSilent:boolean=false
  ): Promise<msal.AuthenticationResult | undefined>  {
    var authResult: msal.AuthenticationResult;
    try {
      console.log('authTokenPopup -> getting-silent-token');
      authResult = await this.msalInstance.acquireTokenSilent(silentRequest);
      console.log('authTokenPopup -> getting-silent-token:success');
      this.isLoggedIn = true;
      this.setLoginState(true,authResult);
      return authResult;
    } catch (err) {
      if (err instanceof msal.InteractionRequiredAuthError && !isSilent && loginRequestConfig) {
        console.log('authTokenPopup -> getting-silent-token:requiresInteraction',err);
        authResult = await this.msalInstance.acquireTokenPopup(loginRequestConfig);
        this.isLoggedIn = true;
        this.setLoginState(true,authResult);
        return authResult;
      }
      console.error("authTokenPopup -> getting-silent-token:failure",err);
      return undefined;
    }
  }

  private async authTokenRedirect (
    silentRequest: msal.SilentRequest,
    redirectRequestConfig?: msal.RedirectRequest | undefined,
    isSilent:boolean=false
  ): Promise<msal.AuthenticationResult | undefined>  {
    try {
      console.log('authTokenRedirect -> getting-silent-token');
      var authResult = await this.msalInstance.acquireTokenSilent(silentRequest);
      console.log('authTokenRedirect -> getting-silent-token:success',authResult);
      this.homeAccountId = authResult.account?.homeAccountId;
      this.isLoggedIn = true;
      this.setLoginState(true,authResult);
      return authResult;
    } catch (err) {
      this.isLoggedIn = false;
      this.setLoginState(false,undefined);
      console.log("authTokenRedirect -> getting-silent-token:error" ,err);
      if (err instanceof msal.InteractionRequiredAuthError && !isSilent) {
        if(redirectRequestConfig) {
          console.log('authTokenRedirect -> attemptingInteraction');
          await this.msalInstance.acquireTokenRedirect(redirectRequestConfig);
        }
      }
      return undefined;
    }
  }

  public async logout()  {
    if (!this.config.endSessionRequestConfig) {
      this.config.endSessionRequestConfig = {};
    }
    this.config.endSessionRequestConfig.account = this.getAccount();
    if (this.usePopup) {
      await this.msalInstance.logoutPopup(this.config.endSessionRequestConfig)
    }else{
      await this.msalInstance.logoutRedirect(this.config.endSessionRequestConfig)
    }
    this.isLoggedIn = false;
    this.setLoginState(false,undefined);
  }

}