import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpRight,
  Mail,
  Send,
  AlertCircle,
  Loader2,
  RotateCcw,
  User,
  Tag,
  MessageSquare,
  Check,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../icons/Brand';
import { about, contact } from '../../portfolio';

const FORMSUBMIT_KEY = import.meta.env.VITE_FORMSUBMIT_KEY;
const FORMSUBMIT_ENDPOINT = FORMSUBMIT_KEY
  ? `https://formsubmit.co/ajax/${FORMSUBMIT_KEY}`
  : null;

const MESSAGE_MAX = 1000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const initialForm = { name: '', email: '', subject: '', message: '' };

const MIN_FILL_MS = 3000;
const COOLDOWN_MS = 30_000;
const MAX_PER_HOUR = 3;
const HOUR_MS = 60 * 60 * 1000;
const HISTORY_KEY = 'portfolio:contact:history';

const URL_RE = /(https?:\/\/|www\.)/gi;
const MAX_URLS = 3;

const SPAM_BLACKLIST = [
  'high da backlinks',
  'quality backlinks',
  'guest posting opportunity',
  'guest post opportunity',
  'link insertion',
  'link building service',
  'improve your ranking',
  'boost your traffic',
  'rank your website',
  'white hat seo',
  'seo services',
  'seo expert',
  'seo audit',
  'redesign your website',
  'redesign your site',
  'mobile-friendly redesign',
  'website redesign',
  'affordable rates',
  'professional web design',

  'crypto investment',
  'bitcoin doubler',
  'nft drop',
  'forex signals',
  'binary options',
  'passive income guaranteed',
  'guaranteed returns',
  'investment opportunity',

  'viagra',
  'cialis',
  'cheap meds',
  'sex chat',
  'adult dating',
  'porn',

  'bulk database',
  'verified leads',
  'email lists',
  'email database',
  'whatsapp marketing',
  'sms blast',

  'casino',
  'gambling',
  'cheap rolex',
  'replica watches',
].join(',');

const hashStr = (s) => {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h) ^ s.charCodeAt(i);
  return (h >>> 0).toString(36);
};

const loadHistory = () => {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    const cutoff = Date.now() - HOUR_MS;
    return Array.isArray(parsed) ? parsed.filter((e) => e.t > cutoff) : [];
  } catch {
    return [];
  }
};

const saveHistory = (entries) => {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(entries));
  } catch {
    /* storage unavailable — silent */
  }
};

const checkSpam = (form, mountedAt) => {
  const now = Date.now();

  if (now - mountedAt < MIN_FILL_MS) {
    return { blocked: true, reason: 'Slow down — give it a moment before sending.' };
  }

  const urlMatches = (form.message.match(URL_RE) || []).length;
  if (urlMatches > MAX_URLS) {
    return { blocked: true, reason: 'Too many links in message. Trim them and retry.' };
  }

  const history = loadHistory();
  const last = history[history.length - 1];

  if (last && now - last.t < COOLDOWN_MS) {
    const wait = Math.ceil((COOLDOWN_MS - (now - last.t)) / 1000);
    return { blocked: true, reason: `Just sent one — try again in ${wait}s.` };
  }

  if (history.length >= MAX_PER_HOUR) {
    return { blocked: true, reason: 'Hourly limit reached. Use the email link directly.' };
  }

  const sig = hashStr(`${form.email}|${form.message}`);
  if (history.some((e) => e.sig === sig)) {
    return { blocked: true, reason: 'Looks like a duplicate of your last message.' };
  }

  return { blocked: false, sig };
};

const Contact = () => {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ state: 'idle', message: '' });
  const mountedAtRef = useRef(Date.now());

  if (!contact.email) return null;

  const hasFormBackend = Boolean(FORMSUBMIT_ENDPOINT);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'message' && value.length > MESSAGE_MAX) return;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setStatus({ state: 'idle', message: '' });
  };

  const isEmailValid = EMAIL_RE.test(form.email);
  const canSubmit =
    form.name.trim().length > 0 &&
    isEmailValid &&
    form.message.trim().length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hasFormBackend || !canSubmit) return;

    if (e.target._honey && e.target._honey.value) {
      setStatus({ state: 'success', message: 'Thanks — message received.' });
      return;
    }

    const spamCheck = checkSpam(form, mountedAtRef.current);
    if (spamCheck.blocked) {
      setStatus({ state: 'error', message: spamCheck.reason });
      return;
    }

    setStatus({ state: 'sending', message: '' });

    try {
      const res = await fetch(FORMSUBMIT_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          _subject: form.subject || `Portfolio contact from ${form.name}`,
          message: form.message,
          _template: 'table',
          _blacklist: SPAM_BLACKLIST,
          _replyto: form.email,
        }),
      });

      const data = await res.json();

      if (res.ok && (data.success === 'true' || data.success === true)) {
        const history = loadHistory();
        history.push({ t: Date.now(), sig: spamCheck.sig });
        saveHistory(history);
        setStatus({
          state: 'success',
          message: "I'll get back to you within a day.",
        });
        setForm(initialForm);
      } else {
        setStatus({
          state: 'error',
          message: data.message || 'Something went wrong. Try the email link instead.',
        });
      }
    } catch (err) {
      setStatus({
        state: 'error',
        message: 'Network error. Try the email link instead.',
      });
    }
  };

  const isSending = status.state === 'sending';
  const isSuccess = status.state === 'success';

  return (
    <section id="contact" className="section">
      <div className="container-x">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative card overflow-hidden p-8 md:p-14"
        >
          <div className="absolute inset-0 bg-gradient-radial from-accent/15 via-transparent to-transparent" />
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-60 w-60 rounded-full bg-accent/30 blur-[100px]" />
          <div className="absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-indigo-500/20 blur-[120px]" />

          <div className="relative grid gap-10 md:gap-14 md:grid-cols-[1fr_1.1fr] items-start">
            <div className="text-center md:text-left">
              <span className="section-eyebrow md:justify-start justify-center">Let&apos;s talk</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mt-2">
                Have a project <br className="hidden md:block" />
                <span className="text-gradient animate-gradient-shift">in mind?</span>
              </h2>
              <p className="mt-6 text-fg-muted max-w-md md:mx-0 mx-auto">
                Open to full-stack & AI roles, contracts, and collaborations.
                Drop a line — usually reply within a day.
              </p>

              <a
                href={`mailto:${contact.email}`}
                className="mt-8 inline-flex items-center gap-2 text-sm font-mono text-fg-muted hover:text-accent transition-colors group"
              >
                <Mail className="h-4 w-4" />
                {contact.email}
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              <div className="mt-6 flex md:justify-start justify-center gap-2 text-fg-muted">
                {about.social?.github && (
                  <a
                    href={about.social.github}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="GitHub"
                    className="p-2.5 rounded-full hover:text-accent hover:bg-bg-alt transition-colors"
                  >
                    <GithubIcon className="h-5 w-5" />
                  </a>
                )}
                {about.social?.linkedin && (
                  <a
                    href={about.social.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn"
                    className="p-2.5 rounded-full hover:text-accent hover:bg-bg-alt transition-colors"
                  >
                    <LinkedinIcon className="h-5 w-5" />
                  </a>
                )}
              </div>
            </div>

            {hasFormBackend ? (
              <div className="relative min-h-[480px]">
                <AnimatePresence mode="wait" initial={false}>
                  {isSuccess ? (
                    <SuccessPanel
                      key="success"
                      message={status.message}
                      onReset={resetForm}
                    />
                  ) : (
                    <motion.form
                      key="form"
                      onSubmit={handleSubmit}
                      className="space-y-4"
                      noValidate
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12, transition: { duration: 0.25 } }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <input
                        type="text"
                        name="_honey"
                        tabIndex="-1"
                        autoComplete="off"
                        className="hidden"
                        aria-hidden="true"
                      />

                      <div className="grid sm:grid-cols-2 gap-4">
                        <FloatingField
                          icon={User}
                          label="Name"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          required
                          disabled={isSending}
                        />
                        <FloatingField
                          icon={Mail}
                          label="Email"
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={handleChange}
                          required
                          disabled={isSending}
                          validIndicator={form.email.length > 0 && isEmailValid}
                          invalidIndicator={form.email.length > 0 && !isEmailValid}
                        />
                      </div>

                      <FloatingField
                        icon={Tag}
                        label="Subject (optional)"
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        disabled={isSending}
                      />

                      <FloatingTextarea
                        icon={MessageSquare}
                        label="Message"
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        required
                        disabled={isSending}
                        maxLength={MESSAGE_MAX}
                      />

                      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                        <motion.button
                          type="submit"
                          disabled={isSending || !canSubmit}
                          whileHover={!isSending && canSubmit ? { scale: 1.02, y: -1 } : undefined}
                          whileTap={!isSending && canSubmit ? { scale: 0.97 } : undefined}
                          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                          className="relative overflow-hidden rounded-full px-6 py-3 text-sm font-medium text-bg
                            bg-gradient-to-r from-accent via-accent to-indigo-400 bg-[length:200%_100%]
                            hover:bg-[position:100%_0] transition-[background-position] duration-500
                            shadow-[0_4px_20px_-4px_rgb(var(--accent)/0.5)] hover:shadow-[0_8px_30px_-4px_rgb(var(--accent)/0.7)]
                            disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
                            inline-flex items-center gap-2 min-w-[180px] justify-center group"
                        >
                          <AnimatePresence mode="wait" initial={false}>
                            {isSending ? (
                              <motion.span
                                key="sending"
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.2 }}
                                className="inline-flex items-center gap-2"
                              >
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Sending...
                              </motion.span>
                            ) : (
                              <motion.span
                                key="idle"
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.2 }}
                                className="inline-flex items-center gap-2"
                              >
                                Send message
                                <Send className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                              </motion.span>
                            )}
                          </AnimatePresence>
                          {isSending && (
                            <motion.span
                              aria-hidden="true"
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                              initial={{ x: '-100%' }}
                              animate={{ x: '100%' }}
                              transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                            />
                          )}
                        </motion.button>

                        <AnimatePresence mode="wait">
                          {status.state === 'error' ? (
                            <motion.span
                              key="error"
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0 }}
                              className="inline-flex items-center gap-2 text-sm text-rose-400"
                              role="alert"
                            >
                              <AlertCircle className="h-4 w-4" />
                              {status.message}
                            </motion.span>
                          ) : !canSubmit ? (
                            <motion.span
                              key="hint"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="text-xs text-fg-subtle font-mono"
                            >
                              Fill required fields to send
                            </motion.span>
                          ) : null}
                        </AnimatePresence>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border-strong bg-bg-alt/40 p-6 text-sm text-fg-muted">
                <p className="font-medium text-fg mb-2">Contact form not configured</p>
                <p>
                  Set <code className="font-mono text-accent">VITE_FORMSUBMIT_KEY</code> in a{' '}
                  <code className="font-mono text-accent">.env.local</code> file (activate at{' '}
                  <a
                    href="https://formsubmit.co"
                    target="_blank"
                    rel="noreferrer"
                    className="link-underline"
                  >
                    formsubmit.co
                  </a>
                  ) to enable the form. Email link works in the meantime.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const FloatingField = ({
  icon: Icon,
  label,
  name,
  type = 'text',
  value,
  onChange,
  required,
  disabled,
  validIndicator,
  invalidIndicator,
}) => {
  const hasValue = value && value.length > 0;
  return (
    <div className="relative group">
      <div
        className="absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-300
          opacity-0 group-focus-within:opacity-100
          bg-gradient-to-r from-accent/40 via-indigo-400/40 to-accent/40 blur-[6px]"
        aria-hidden="true"
      />
      <div className="relative rounded-xl bg-bg-alt/60 border border-border focus-within:border-accent/60 transition-colors">
        {Icon && (
          <Icon
            className={`absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors pointer-events-none
              ${hasValue ? 'text-accent' : 'text-fg-subtle group-focus-within:text-accent'}`}
          />
        )}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          autoComplete={
            name === 'email' ? 'email' : name === 'name' ? 'name' : 'off'
          }
          placeholder=" "
          className="peer w-full bg-transparent outline-none px-4 pl-11 pt-6 pb-2 text-sm text-fg
            placeholder-transparent disabled:opacity-60 rounded-xl"
        />
        <label
          htmlFor={name}
          className={`absolute left-11 pointer-events-none transition-all duration-200 font-mono uppercase tracking-[0.12em]
            ${hasValue
              ? 'top-1.5 text-[10px] text-accent'
              : 'top-1/2 -translate-y-1/2 text-xs text-fg-subtle peer-focus:top-1.5 peer-focus:translate-y-0 peer-focus:text-[10px] peer-focus:text-accent'}`}
        >
          {label}
          {required && <span className="ml-1">*</span>}
        </label>

        <AnimatePresence>
          {validIndicator && (
            <motion.span
              key="valid"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
              className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-emerald-400/15 border border-emerald-400/40 flex items-center justify-center"
            >
              <Check className="h-3 w-3 text-emerald-400" strokeWidth={3} />
            </motion.span>
          )}
          {invalidIndicator && !validIndicator && (
            <motion.span
              key="invalid"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute right-4 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-rose-400/80"
              aria-hidden="true"
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const FloatingTextarea = ({
  icon: Icon,
  label,
  name,
  value,
  onChange,
  required,
  disabled,
  maxLength,
}) => {
  const ref = useRef(null);
  const hasValue = value && value.length > 0;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 280) + 'px';
  }, [value]);

  const counterWarn = maxLength && value.length >= maxLength * 0.9;

  return (
    <div className="relative group">
      <div
        className="absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-300
          opacity-0 group-focus-within:opacity-100
          bg-gradient-to-r from-accent/40 via-indigo-400/40 to-accent/40 blur-[6px]"
        aria-hidden="true"
      />
      <div className="relative rounded-xl bg-bg-alt/60 border border-border focus-within:border-accent/60 transition-colors">
        {Icon && (
          <Icon
            className={`absolute left-4 top-6 h-4 w-4 transition-colors pointer-events-none
              ${hasValue ? 'text-accent' : 'text-fg-subtle group-focus-within:text-accent'}`}
          />
        )}
        <textarea
          ref={ref}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          rows={4}
          placeholder=" "
          className="peer w-full bg-transparent outline-none px-4 pl-11 pt-7 pb-7 text-sm text-fg
            placeholder-transparent disabled:opacity-60 rounded-xl resize-none min-h-[140px] max-h-[280px]
            leading-relaxed"
        />
        <label
          htmlFor={name}
          className={`absolute left-11 pointer-events-none transition-all duration-200 font-mono uppercase tracking-[0.12em]
            ${hasValue
              ? 'top-2 text-[10px] text-accent'
              : 'top-6 text-xs text-fg-subtle peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-accent'}`}
        >
          {label}
          {required && <span className="ml-1">*</span>}
        </label>

        {maxLength && (
          <span
            className={`absolute bottom-2 right-3 text-[10px] font-mono transition-colors
              ${counterWarn ? 'text-amber-400' : 'text-fg-subtle'}`}
            aria-live="polite"
          >
            {value.length}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
};

const SuccessPanel = ({ message, onReset }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.96, y: 12 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.96, y: -12 }}
    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    className="relative flex flex-col items-center justify-center text-center py-12 md:py-16 px-4 rounded-2xl bg-bg-alt/40 border border-emerald-400/20 overflow-hidden"
    role="status"
    aria-live="polite"
  >
    <AnimatedCheck />
    <ParticleBurst />

    <motion.h3
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.4 }}
      className="font-display text-2xl md:text-3xl font-bold tracking-tight mt-6"
    >
      Message sent!
    </motion.h3>

    <motion.p
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55, duration: 0.4 }}
      className="mt-3 text-fg-muted max-w-sm"
    >
      {message}
    </motion.p>

    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.4 }}
      onClick={onReset}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      className="btn-ghost mt-8 group"
    >
      <RotateCcw className="h-4 w-4 transition-transform group-hover:-rotate-45" />
      Send another
    </motion.button>
  </motion.div>
);

const AnimatedCheck = () => (
  <div className="relative">
    <motion.span
      className="absolute inset-0 rounded-full bg-emerald-400/20"
      initial={{ scale: 0, opacity: 0.8 }}
      animate={{ scale: 2.4, opacity: 0 }}
      transition={{ duration: 1, ease: 'easeOut' }}
    />
    <motion.span
      className="absolute inset-0 rounded-full bg-emerald-400/15"
      initial={{ scale: 0, opacity: 0.6 }}
      animate={{ scale: 3.2, opacity: 0 }}
      transition={{ duration: 1.4, ease: 'easeOut', delay: 0.15 }}
    />
    <motion.div
      initial={{ scale: 0, rotate: -90 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.05 }}
      className="relative h-20 w-20 rounded-full bg-emerald-400/10 border border-emerald-400/40 flex items-center justify-center"
    >
      <svg
        viewBox="0 0 52 52"
        className="h-10 w-10 text-emerald-400"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <motion.path
          d="M14 27l8 8 16-18"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.25, ease: 'easeOut' }}
        />
      </svg>
    </motion.div>
  </div>
);

const ParticleBurst = () => {
  const particles = Array.from({ length: 12 });
  return (
    <div className="pointer-events-none absolute top-12 md:top-16 left-1/2 -translate-x-1/2">
      {particles.map((_, i) => {
        const angle = (i / particles.length) * Math.PI * 2;
        const distance = 70 + (i % 3) * 14;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        const size = i % 2 === 0 ? 6 : 4;
        return (
          <motion.span
            key={i}
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              background: i % 3 === 0
                ? 'rgb(167 139 250)'
                : 'rgb(52 211 153)',
              left: -size / 2,
              top: -size / 2,
            }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
            animate={{ x, y, opacity: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2 + (i % 4) * 0.04, ease: 'easeOut' }}
          />
        );
      })}
    </div>
  );
};

export default Contact;
