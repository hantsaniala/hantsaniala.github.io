export const site = {
  title: "Hantsaniala Eléo",
  description:
    "Freelance software developer specializing in Go, Python, and full-stack development. Available for consulting and contract work.",
  url: "https://hantsaniala.is-a.dev",
  author: "Hantsaniala Eléo",

  firstName: "Hantsaniala",
  lastName: "Eléo",
  role: "Freelance Software Developer",
  email: "hantsaniala@gmail.com",
  phone: "(+261)32 99 025 43",
  whatsapp: "https://wa.me/261329902543",
  address: "Tanjondava, Talatamaty, Ambohidratrimo - 105",
  profileImage: "/img/profile2.png",
  logo: "/img/logo.png",

  bio: `Freelance software developer with over a decade of experience building robust backend systems, APIs, and full-stack applications. I specialize in Go and Python, with deep expertise in microservices architecture, cloud infrastructure, and open-source tooling. Available for consulting, contract work, and long-term collaborations.`,

  sections: ["skills", "experience", "education"] as const,

  socials: [
    { name: "LinkedIn", url: "https://www.linkedin.com/in/hantsaniala/", icon: "linkedin-logo" },
    { name: "GitHub", url: "https://github.com/hantsaniala/", icon: "github-logo" },
    {
      name: "Stack Overflow",
      url: "https://stackoverflow.com/users/5527968/hantsaniala-eléo",
      icon: "stack-overflow-logo",
    },
    { name: "Keybase", url: "https://keybase.io/hantsaniala", icon: "key" },
    { name: "Facebook", url: "https://fb.me/hantsaniala", icon: "facebook-logo" },
    { name: "Telegram", url: "https://t.me/hantsaniala3", icon: "telegram-logo" },
    { name: "WhatsApp", url: "https://wa.me/261329902543", icon: "whatsapp-logo" },
  ] as const,

  navItems: [
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Experience", href: "#experience" },
    { label: "Education", href: "#education" },
    { label: "Blog", href: "/blog" },
  ] as const,
} as const;

export type SiteConfig = typeof site;
