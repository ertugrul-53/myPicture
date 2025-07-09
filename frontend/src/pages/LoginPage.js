import React, {useState} from "react";

function LoginPaage(){
    const[email,setEmail]=useState("");
    const [password,setPassword]=useState("");

    const handleLogin= async (e)=>{

            e.preventDefault();

             const response = await fetch("http://localhost:5000/api/login",{   method : "POST",
                                                                                headers: {"Content-Type": "application/json"},
                                                                                body:JSON.stringify({email,password}),
                                                                });
             const data= await response.json();
                         if(response.ok ){
                                alert("giriş başarılı"+data.userName);


                         }else{
                                alert("hata : "+ data.message);
                                 }
                             };

  
  





  return(
            <div>
                  <h2> giriş yap </h2>

                  <form onSubmit={handleLogin}>
                     <input type="email"
                            placeholder="E mail"
                            value={email}
                            onChange={(e)=> setEmail(e.target.value)}/>
                     <br />
                     <input  type="password"
                             placeholder="Password"
                             value={password}
                             onChange={(e)=>setPassword(e.target.value)} />
                    <br />
                    <button type="submit">giriş yap</button>
                            
                     
                     
                  </form>

            </div>   
  );




};
export default LoginPaage;