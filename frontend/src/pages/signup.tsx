import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FormInput,
  FormLabel,
  FormRow,
  PrimaryBtn,
} from "../components/index.component";

export function Signup() {
  const [userDetails, setUserDetails] = useState({
    firstName: "",
    lastName: "",
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
      const res = await fetch("http://localhost:8001/api/v1/user/signup", {
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
    <div className=" flex items-center justify-center h-screen">
      <form className=" flex flex-col gap-y-3">
        <FormRow>
          <FormLabel htmlFor={"firstName"} label={"First Name"} />
          <FormInput
            onChange={(e) => handleChange("firstName", e.target.value)}
            type={"text"}
            name={"firstName"}
            id={"firstName"}
            value={userDetails.firstName || ""}
          />
        </FormRow>
        <FormRow>
          <FormLabel htmlFor={"lastName"} label={"Last Name"} />
          <FormInput
            onChange={(e) => handleChange("lastName", e.target.value)}
            type={"text"}
            name={"lastName"}
            id={"lastName"}
            value={userDetails.lastName || ""}
          />
        </FormRow>
        <FormRow>
          <FormLabel htmlFor={"username"} label={"Username"} />
          <FormInput
            onChange={(e) => handleChange("username", e.target.value)}
            type={"email"}
            name={"username"}
            id={"username"}
            value={userDetails.username || ""}
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
