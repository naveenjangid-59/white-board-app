import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styles from "./AuthModal.module.css";
import api from "../../Api";

function AuthModal({
  clickedOn,
  showAuthModal,
  onClose,
  changeClickedOn,
  setLoginStatusHandler,
  setProfileHandler,
}) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm();

  const navigate = useNavigate();

  if (!showAuthModal) return null;

  const onSubmit = async (data) => {
    clearErrors("root");

    try {
      if (clickedOn === "login") {
        const res = await api.post("/user/login", {
          email: data.email,
          password: data.password,
        });

        setLoginStatusHandler(true);
        setProfileHandler(res.data);
        reset();
        onClose();
        navigate("/dashboard");
      } else {
        await api.post("/user/register", {
          username: data.name,
          email: data.email,
          password: data.password,
        });

        reset();
        clearErrors();
        changeClickedOn("login");
      }
    } catch (error) {
      setError("root", {
        type: "server",
        message:
          error?.response?.data?.message ||
          error.message ||
          "Something went wrong",
      });
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modalContainer}>
        <button className={styles.closeBtn} onClick={onClose} type="button">
          ×
        </button>

        {/* HEADER */}
        <div className={styles.header}>
          <h2 className={styles.title}>
            {clickedOn === "login" ? "Welcome back" : "Create account"}
          </h2>
          <p className={styles.subtitle}>
            {clickedOn === "login"
              ? "Login to continue"
              : "Sign up to get started"}
          </p>
        </div>

        {/*  ERROR */}
        {errors.root?.message && (
          <p className={styles.errorBanner}>{errors.root.message}</p>
        )}

        {/*  FORM */}
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          {clickedOn === "signup" && (
            <div className={styles.inputGroup}>
              <label>Name</label>
              <input
                {...register("name", { required: "Name required" })}
                placeholder="John Doe"
              />
              {errors.name && (
                <p className={styles.errorText}>{errors.name.message}</p>
              )}
            </div>
          )}

          <div className={styles.inputGroup}>
            <label>Email</label>
            <input
              {...register("email", {
                required: "Email required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email",
                },
              })}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className={styles.errorText}>{errors.email.message}</p>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label>Password</label>
            <input
              type="password"
              {...register("password", {
                required: "Password required",
                minLength: {
                  value: 6,
                  message: "Min 6 characters",
                },
              })}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className={styles.errorText}>{errors.password.message}</p>
            )}
          </div>

          {/*  BUTTON */}
          <button
            className={styles.submitBtn}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Please wait..."
              : clickedOn === "login"
                ? "Login"
                : "Sign Up"}
          </button>
        </form>

        {/* FOOTER */}
        <div className={styles.footer}>
          {clickedOn === "login" ? "New here?" : "Already have an account?"}
          <button
            type="button"
            className={styles.toggleBtn}
            onClick={() => {
              clearErrors();
              reset();
              changeClickedOn(clickedOn === "login" ? "signup" : "login");
            }}
          >
            {clickedOn === "login" ? "Create one" : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
