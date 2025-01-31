import React, { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import { styles } from "../styles";
import { EarthCanvas } from "./canvas";
import SectionWrapper from "../hoc/SectionWrapper";
import { slideIn } from "../utils/motion";
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from "react-google-recaptcha-v3";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const service_id = import.meta.env.VITE_SERVICE_ID;
  const template_id = import.meta.env.VITE_TEMPLATE_ID;
  const public_id = import.meta.env.VITE_PUBLIC_ID;
  const to_email = import.meta.env.VITE_TO_EMAIL;
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!captchaToken) {
      alert("Please complete the reCAPTCHA!");
      return;
    }

    setLoading(true);
    emailjs
      .send(
        service_id,
        template_id,
        {
          from_name: form.name,
          to_name: "Somesh",
          to_email: to_email,
          from_email: form.email,
          message: form.message,
          recaptcha_token: captchaToken,
        },
        public_id
      )
      .then(
        () => {
          setLoading(false);
          alert("Thank you! I will get back to you as soon as possible.");
          setForm({
            name: "",
            email: "",
            message: "",
          });
        },
        (error) => {
          setLoading(false);
          console.log(error);
          alert("Something went wrong");
        }
      );
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleCaptcha = useCallback(async () => {
    if (!executeRecaptcha) {
      console.log("Execute recaptcha not yet available");
      return;
    }

    const token = await executeRecaptcha("contact_form_submit");
    setCaptchaToken(token);
  }, [executeRecaptcha]);

  return (
    <div className="xl:mt-12 xl:flex-row flex-col-reverse flex gap-2 overflow-hidden">
      <motion.div
        variants={slideIn("left", "tween", 0.2, 1)}
        className="flex-[0.75] bg-black-100 p-4 rounded-2xl"
      >
        <p className={`${styles.sectionSubText}`}>Get in touch</p>
        <h3 className={`${styles.sectionHeadText}`}>Contact.</h3>
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="mt-12 flex flex-col gap-8"
        >
          <label className="flex flex-col">
            <span className="text-white font-medium mb-4">Your Name</span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="What's your name?"
              className="bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium"
            />
          </label>
          <label className="flex flex-col">
            <span className="text-white font-medium mb-4">Your Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="What's your email?"
              className="bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium"
            />
          </label>
          <label className="flex flex-col">
            <span className="text-white font-medium mb-4">Your Message</span>
            <textarea
              rows={7}
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="What do you want to say?"
              className="bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium"
            />
          </label>
          <div className="flex flex-col">
            <button
              type="button"
              onClick={handleCaptcha}
              className="py-3 hover:bg-[#6f5e8f] bg-tertiary px-8 outline-none w-fit text-white shadow-md font-bold shadow-primary rounded-xl"
            >
              Verify reCAPTCHA
            </button>
          {captchaToken && <span className="text-green-500 flex ml-9 text-[13px]">CAPTCHA VERIFIED</span>}
          </div>
          <button
            type="submit"
            className={`py-3  ${captchaToken?" bg-tertiary hover:bg-[#6f5e8f]":"bg-[#b7a7b6]"} px-8 outline-none w-fit text-white shadow-md font-bold
             shadow-primary rounded-xl`}
          >
            {loading ? "Sending" : "Send"}
          </button>
        </form>
      </motion.div>
      <motion.div
        variants={slideIn("right", "tween", 0.2, 1)}
        className="xl:flex-1 xl:h-auto md:h-[550px] h-[350px]"
      >
        <EarthCanvas />
      </motion.div>
    </div>
  );
};

const WrappedContact = SectionWrapper({
  Component: Contact,
  idName: "contact",
});

const App = () => {
  return (
    <GoogleReCaptchaProvider reCaptchaKey="6LdCJ8kqAAAAAJ47dClJ_I7ZPO5OmEU-ZF9uCD17">
      <WrappedContact />
    </GoogleReCaptchaProvider>
  );
};

export default App;
