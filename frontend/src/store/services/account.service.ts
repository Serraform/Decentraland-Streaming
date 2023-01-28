import {client} from "store/clientConfig";
export const createAccount = async (walletID: string) => {
  return await client.post("/api/User/CreateUser", {
    walletID: walletID
  });
};

export const getAccountDetailsByWalletId = async (walletID: string) => {
  return await client.get(`/api/User/GetUserDetailsByWalletId/${walletID}`);
};

export const getSignatureChallenge = async (walletID: string, network:string, chainId:string) => {
  return await client.post(`/Authentication/${walletID}/0/${chainId}`);
};

const parse = (text:string) => {
  try {
     return JSON.parse(text);
  } catch(e){
     return text;
  }
}

// AJAX call
const xhr = (method: string, url:string, data:string) => {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    
    xhr.open(method, url);

    // Set CORS headers
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest'); 
    xhr.setRequestHeader('Access-Control-Allow-Origin', '*');

    // Create a response listener
    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        // Handle good response
        resolve(parse(xhr.response));
      } else {
        // Handle error response
        reject({
          status: this.status,
          statusText: xhr.statusText
        });
      }
    };

    // Create an error listener
    xhr.onerror = function () {
      reject({
        status: this.status,
        statusText: xhr.statusText
      });
    };

    // Send the request
    if(method==="POST" && data){
      xhr.setRequestHeader('Content-type', 'application/json'); 
        xhr.send(data);
    }else{
        xhr.send();
    }
  });
}

export const verifySignature = async (body: any) => {
  return await xhr("POST", `${process.env.REACT_APP_API_BASE}Authentication/verify/0`, body);
  // return await client.post(`/Authentication/verify/0`, body)
}