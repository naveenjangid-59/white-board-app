import React, { useContext, useState } from "react";
import styles from "./LandingPage.module.css";
import mockupImage from "../../assets/mockupImage.png";
import AuthModal from "../AuthModal/AuthModal";
import { BoardContext } from "../../store/BoardContext.jsx";
import { Link, useNavigate } from "react-router-dom";

const LandingPage = () => {
  const {
    setLoginStatusHandler,
    setProfileHandler,
    profile,
    isLoggedIn,
    logoutHandler,
  } = useContext(BoardContext);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [clickedOn, setClikedOn] = useState("");
  const navigate = useNavigate();

  const loginClickHandler = () => {
    setShowAuthModal(true);
    setClikedOn("login");
  };
  const signupClickHandler = () => {
    setShowAuthModal(true);
    setClikedOn("signup");
  };

  const onclose = () => {
    setClikedOn("");
    setShowAuthModal(false);
  };

  const changeClickedOn = (value) => {
    setClikedOn(value);
  };
  const startButtonHandler = () => {
    isLoggedIn
      ? navigate("/dashboard")
      : (setShowAuthModal(true), setClikedOn("login"));
  };

  return (
    <>
      <div className={styles.container}>
        {/* Header / Navigation */}
        <header className={styles.header}>
          <Link to="/" className={styles.logo}>
            BoardFlow
          </Link>
          <div className={styles.navButtons}>
            {isLoggedIn ? (
              <div className={styles.userActions}>
                <span className={styles.welcomeText}>
                  Welcome, {profile?.username?.toUpperCase() || "JI"}!
                </span>
                <button className={styles.logoutBtn} onClick={logoutHandler}>
                  Log Out
                </button>
              </div>
            ) : (
              <>
                <button className={styles.loginBtn} onClick={loginClickHandler}>
                  Log In
                </button>
                <button
                  className={styles.signupBtn}
                  onClick={signupClickHandler}
                >
                  Sign Up Free
                </button>
              </>
            )}
          </div>
        </header>

        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>
            Think, Create, and Collaborate{" "}
            <span className={styles.highlight}>Without Limits.</span>
          </h1>
          <p className={styles.heroSubtitle}>
            The modern whiteboard for teams that move fast. Brainstorm, plan,
            and execute your ideas on an infinite, real-time canvas.
          </p>
          <button className={styles.ctaBtn} onClick={startButtonHandler}>
            Start Whiteboarding
          </button>

          {/* App Mockup / Visual Placeholder */}
          <div className={styles.heroImagePlaceholder}>
            <img
              src={mockupImage}
              alt="BoardFlow App Mockup"
              className={styles.mockupImg}
            />
          </div>
        </section>

        {/* Features Section */}
        <section className={styles.features}>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>⚡</div>
              <h3 className={styles.featureTitle}>Real-time Collaboration</h3>
              <p className={styles.featureDesc}>
                Work together with your team in real-time. See cursors move,
                ideas form, and projects come to life instantly.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>♾️</div>
              <h3 className={styles.featureTitle}>Infinite Canvas</h3>
              <p className={styles.featureDesc}>
                Never run out of space. Zoom in for granular details or zoom out
                for the big picture. Your ideas have room to grow.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🎨</div>
              <h3 className={styles.featureTitle}>Smart Drawing Tools</h3>
              <p className={styles.featureDesc}>
                From sticky notes to perfect shapes. Our smart vector tools make
                formatting effortless so you can focus on creativity.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className={styles.footer}>
          <p>
            &copy; {new Date().getFullYear()} BoardFlow Inc. All rights
            reserved.
          </p>
        </footer>
      </div>
      <div>
        <AuthModal
          clickedOn={clickedOn}
          showAuthModal={showAuthModal}
          onClose={onclose}
          changeClickedOn={changeClickedOn}
          setLoginStatusHandler={setLoginStatusHandler}
          setProfileHandler={setProfileHandler}
        />
      </div>
    </>
  );
};

export default LandingPage;
