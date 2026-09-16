// Single source of truth for the documentation site structure.
window.KOYO_NAV = {
  brand: {
    name: "Koyo Docs",
    href: "index.html",
  },
  sections: [
    {
      label: "Getting started",
      links: [
        { page: "getting-started", label: "Install and quickstart" },
        { page: "dependencies", label: "Dependencies" },
      ],
    },
    {
      label: "Framework",
      links: [
        { page: "routing", label: "Routing" },
        { page: "layouts", label: "Layouts" },
        { page: "components", label: "Components" },
        { page: "metadata", label: "Metadata" },
        { page: "styling", label: "Styling and theme" },
      ],
    },
    {
      label: "Interactive",
      links: [
        { page: "interactivity", label: "Interactivity (htmx)" },
        { page: "state", label: "Session state" },
      ],
    },
    {
      label: "Workflow",
      links: [
        { page: "dev-tooling", label: "Development tooling" },
        { page: "production-build", label: "Production build" },
        { page: "deploying", label: "Deploying" },
        { page: "cli-reference", label: "CLI reference" },
        { page: "faq", label: "FAQ and support" },
      ],
    },
  ],
};