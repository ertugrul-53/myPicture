import React from "react";
import   "./HomePage.css"
import ImageSlider from "../compononts/ImageSlider";
import  ImageSlider2  from "../compononts/ImageSlider2";


function HomePage(){
        return(

            <div className="homepage-container">
                
                <ImageSlider></ImageSlider>
                <h2>myPictures a  hoş geldiniz</h2>
                <ImageSlider2></ImageSlider2>
                   

            </div>
        );

}


export default HomePage;