const Button = ({
  children,
  onClick,
  variant = "primary",
  className = "",
  disabled,
}) => {
  const base =
    "px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-dark focus:ring-primary",
    secondary:
      "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600",
    danger: "bg-red-500 text-white hover:bg-red-600",
    outline:
      "border border-primary text-primary hover:bg-primary-50 dark:hover:bg-dark-card",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant] || variants.primary} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
