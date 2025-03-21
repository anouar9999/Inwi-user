import React from "react";

import * as Styles from "./styles";

import Divider from "../divider";
// import Platforms from "../platforms";

import { ButtonOutline } from "../button/styles.js";
import { Button } from "../button/index.jsx";
import Navbar from "../navbar";

const BannerSection = () => {
  return (
    <Styles.BannerSection>
      <Navbar />
      <Divider />
      <Styles.BannerContainer>
        <Styles.BannerInfo>
          <Styles.BannerText>
            <h2>VALUE</h2>
            <h1>Gaming Mania</h1>
            <p>
              Welcome to our gaming recommendation site, your ultimate
              destination for discovering new adventures and unlocking endless
              entertainment. Explore curated recommendations, insightful
              reviews, and comprehensive guides tailored to your gaming
              preferences. Join a vibrant community of fellow gamers and embark
              on epic quests together. Let the games begin!
            </p>
            <Styles.BannerFlexButtons>
              <Button className="large">Play Game</Button>
              <ButtonOutline className="large">Search More</ButtonOutline>
            </Styles.BannerFlexButtons>
            <Styles.BannerDivider />
            <Styles.BannerPlataforms>
              {/*<span className='transparent'>Play it on</span>*/}
              {/* <Platforms /> */}
            </Styles.BannerPlataforms>
          </Styles.BannerText>
        </Styles.BannerInfo>

        <Styles.BannerMascotContainer>
          {/* <img src={hero2} alt="hero" style={{ pointerEvents: "none" }} /> */}
        </Styles.BannerMascotContainer>
      </Styles.BannerContainer>
    </Styles.BannerSection>
  );
};

export default BannerSection;
