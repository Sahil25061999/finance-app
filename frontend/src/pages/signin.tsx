import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormRow } from "../components/formRow";
import { FormLabel,FormInput,PrimaryBtn } from "../components/index.component";

export function Signin() {
  const [userDetails, setUserDetails] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (currentDetail, value) => {
    setUserDetails((prev) => ({ ...prev, [currentDetail]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8001/api/v1/user/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userDetails),
      });
      const resJson = await res.json();

      if (resJson?.success) {
        localStorage.setItem("token", resJson.data.token);
        navigate("/dashboard");
      }
    } catch (e) {}
  };
  return (
    <div className=" h-screen flex justify-center items-center">
      <form className=" flex flex-col gap-y-3">
        <FormRow>
          <FormLabel label={"Username"} htmlFor={"username"} />
          <FormInput
            onChange={(e) => handleChange("username", e.target.value)}
            type={"email"}
            name={"username"}
            id={"username"}
            value={userDetails.username}
          />
        </FormRow>
        <FormRow>
          <FormLabel label={"Password"} htmlFor={"password"} />
          <FormInput
            onChange={(e) => handleChange("password", e.target.value)}
            type={"password"}
            id={"password"}
            name={"password"}
            value={userDetails.password || ""}
          />
        </FormRow>
        <PrimaryBtn onClick={handleSubmit} buttonText={"Signup"} />
      </form>
    </div>
  );
}
