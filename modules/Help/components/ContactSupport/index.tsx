"use client";

import { FormEvent, useState } from "react";
import Button from "@/Components/Button";
import styles from "./ContactSupport.module.scss";

const ContactSupport = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const canSend = subject.trim() !== "" && message.trim() !== "";

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSend || sending) return;
    setSending(true);
    // Placeholder submit until a support endpoint exists.
    window.setTimeout(() => {
      setSending(false);
      setSent(true);
      setSubject("");
      setMessage("");
    }, 600);
  };

  return (
    <section className={styles.card}>
      <h2 className={styles.title}>Contact support</h2>
      <p className={styles.subtitle}>We usually reply within 24 hours.</p>

      {sent && (
        <div className={styles.successBanner} role="status">
          Message sent — our team replies within 24h. You can also email
          support@swipeo.io
        </div>
      )}

      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.field}>
          <span className={styles.label}>Subject</span>
          <input
            className={styles.input}
            type="text"
            placeholder="What do you need help with?"
            value={subject}
            onChange={(event) => {
              setSubject(event.target.value);
              setSent(false);
            }}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Message</span>
          <textarea
            className={styles.textarea}
            rows={6}
            placeholder="Describe your issue in as much detail as you can…"
            value={message}
            onChange={(event) => {
              setMessage(event.target.value);
              setSent(false);
            }}
          />
        </label>

        <Button type="submit" fullWidth loading={sending} disabled={!canSend}>
          Send message
        </Button>
      </form>
    </section>
  );
};

export default ContactSupport;
