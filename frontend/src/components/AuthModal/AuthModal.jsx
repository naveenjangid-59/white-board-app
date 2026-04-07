import { useState } from "react";
import { useForm } from "react-hook-form";
import Header from "./Header";

export function AuthModal() {
  const { register, handleSubmit } = useForm();
  const [data, setData] = useState("");

  return (
    <div>
      <form onSubmit={handleSubmit((data) => setData(JSON.stringify(data)))}>
        <input {...register("firstName")} placeholder="Name" />
        <input {...register("aboutYou")} placeholder="Email" />
        <input type="submit" />
      </form>
    </div>
  );
}
