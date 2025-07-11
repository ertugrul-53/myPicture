import React from "react";
import   "./HomePage.css"
import ImageSlider from "../compononts/ImageSlider";

function HomePage(){
        return(

            <div className="homepage-container">
                <h2>myPictures a  hoş geldiniz</h2>
                <ImageSlider></ImageSlider>

            </div>
        );

}


export default HomePage;