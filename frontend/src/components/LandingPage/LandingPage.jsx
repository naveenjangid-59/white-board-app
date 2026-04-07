import React from "react";
import styles from "./LandingPage.module.css";
import mockupImage from "../../assets/mockupImage.png";
import { useState, useEffect } from "react";

const LandingPage = () => {
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Check if user is logged in by making an API call to the backend
    const checkLoginStatus = async () => {
      try {
        const response = await fetch("http://localhost:3030/api/user/profile", {
          method: "GET",
          credentials: "include", // Include cookies in the request
        });

        if (response.ok) {
          const data = await response.json();
          setIsLoggedin(true);
          setUserData(data.data); // Assuming the user data is in the 'data' field of the response
        } else {
          setIsLoggedin(false);
          setUserData(null);
        }
      } catch (error) {
        console.error("Error checking login status:", error);
        setIsLoggedin(false);
        setUserData(null);
      }
    };

    checkLoginStatus();
  }, []);
  const loginClickHandler = () => {};
  const signupClickHandler = () => {};
  return (
    <>
      <div className={styles.container}>
        {/* Header / Navigation */}
        <header className={styles.header}>
          <a href="/" className={styles.logo}>
            BoardFlow
          </a>
          <div className={styles.navButtons}>
            {isLoggedin ? (
              <div>
                <span>Welcome, {userData?.name || "User"}!</span>
                <button className={styles.logoutBtn}>Log Out</button>
              </div>
            ) : (
              <>
                <button
                  className={styles.loginBtn}
                  onClick={() => {
                    loginClickHandler;
                  }}
                >
                  Log In
                </button>
                <button
                  className={styles.signupBtn}
                  onClick={() => {
                    signupClickHandler;
                  }}
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
          <button className={styles.ctaBtn}>Start Whiteboarding</button>

          {/* App Mockup / Visual Placeholder */}
          <div className={styles.heroImagePlaceholder}>
            <img
              src={mockupImage}
              alt="BoardFlow App Mockup"
              className={styles.mockupImage}
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
        <AuthModal />
      </div>
    </>
  );
};

export default LandingPage;
