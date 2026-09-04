import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FiUser,
  FiLock,
  FiBell,
  FiMoon,
  FiSun,
  FiSave,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCamera,
  FiTrash2,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiAlertCircle,
  FiSmartphone,
  FiGlobe,
  FiShield,
} from "react-icons/fi";
import api from "../../services/api";
import {
  Get_User,
  Update_Profile,
  Update_Password,
} from "../../services/userService";
import Button from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const ProfileSettings = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();

  // Active tab state
  const [activeTab, setActiveTab] = useState("profile");

  // Loading states
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [notificationLoading, setNotificationLoading] = useState(false);

  // Success/Error messages
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    department: "", // For teachers
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Password visibility
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Notification preferences
  const [notificationPrefs, setNotificationPrefs] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    attendanceAlerts: true,
    gradeAlerts: true,
    feeAlerts: true,
    courseUpdates: true,
    systemAnnouncements: false,
  });

  // Profile image state
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // Load user data on mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      try {
        // Fetch user profile data
        const response = await Get_User(user?.userId, user?.role);
        const userData = response?.user || response.data;

        setProfileForm({
          firstName: userData.first_name || "",
          lastName: userData.last_name || "",
          email: userData.email || user?.email || "",
          phone: userData.phone || "",
          address: userData.address || "",
          department: userData.department || "",
        });

        // Set notification preferences if available
        if (userData.notification_prefs) {
          setNotificationPrefs({
            ...notificationPrefs,
            ...userData.notification_prefs,
          });
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        // Use fallback data from auth context
        setProfileForm({
          firstName: "",
          lastName: "",
          email: user?.email || "",
          phone: "",
          address: "",
          department: "",
        });
      }
    };

    fetchUserProfile();
  }, [user]);

  // Handle profile form changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm({ ...profileForm, [name]: value });
  };

  // Handle password form changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm({ ...passwordForm, [name]: value });
  };

  // Handle notification preference changes
  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationPrefs({ ...notificationPrefs, [name]: checked });
  };

  // Handle profile image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image removal
  const handleImageRemove = () => {
    setProfileImage(null);
    setImagePreview("");
  };

  // Save profile
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setSuccessMessage("");
    setErrorMessage("");
    const user = JSON.parse(localStorage.getItem("user"));

    try {
      // Create FormData for file upload
      const formData = new FormData();
      Object.keys(profileForm).forEach((key) => {
        formData.append(key, profileForm[key]);
      });
      if (profileImage) {
        formData.append("profile_image", profileImage);
      }

      // Call API to update profile
      const update_profile = await Update_Profile(
        user?.userId,
        user?.role,
        profileForm,
      );

      if (update_profile) {
        toast.success("Profile updated successfully!");
      } else {
        toast.error("Failed to update profile");
      }

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Failed to update profile:", error);
      setErrorMessage(error.message || "Failed to update profile");
    } finally {
      setProfileLoading(false);
    }
  };

  // Change password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Validate passwords
    if (passwordForm.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setPasswordLoading(true);

    try {
      await Update_Password(user?.userId, user?.role, {
        current_password: passwordForm.currentPassword,
        new_password: passwordForm.newPassword,
      });

      toast.success("Password changed successfully!");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setTimeout(() => toast.dismiss(), 3000);
    } catch (error) {
      console.error("Failed to change password:", error);
      toast.error(error.message || "Failed to change password");
    } finally {
      setPasswordLoading(false);
    }
  };

  // Save notification preferences
  const handleSaveNotifications = async (e) => {
    e.preventDefault();
    setNotificationLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      await api.put("/auth/notifications", notificationPrefs);
      toast.success("Notification preferences saved!");
      setTimeout(() => toast.dismiss(), 3000);
    } catch (error) {
      console.error("Failed to save notifications:", error);
      toast.error(error.message || "Failed to save notification preferences");
    } finally {
      setNotificationLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      navigate("/login");
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] });
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary dark:text-white">
          Settings
        </h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="flex items-center gap-2 p-4 mb-6 text-green-600 border border-green-200 rounded-lg bg-green-50 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">
          <FiCheckCircle className="flex-shrink-0 w-5 h-5" />
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-2 p-4 mb-6 text-red-600 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
          <FiAlertCircle className="flex-shrink-0 w-5 h-5" />
          {errorMessage}
        </div>
      )}

      {/* Settings Layout */}
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Sidebar Navigation */}
        <div className="flex-shrink-0 lg:w-64">
          <div className="p-2 bg-white border border-gray-100 shadow-sm dark:bg-dark-card rounded-xl dark:border-dark-border">
            <nav className="space-y-1">
              {[
                { id: "profile", label: "Profile", icon: FiUser },
                { id: "password", label: "Password", icon: FiLock },
                { id: "notifications", label: "Notifications", icon: FiBell },
                {
                  id: "appearance",
                  label: "Appearance",
                  icon: darkMode ? FiSun : FiMoon,
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? "bg-primary text-white"
                      : "text-gray-600 dark:text-gray-400 hover:bg-primary-50 dark:hover:bg-dark-bg"
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Account Info Card */}
          <div className="p-4 mt-4 bg-white border border-gray-100 shadow-sm dark:bg-dark-card rounded-xl dark:border-dark-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/20">
                <span className="text-lg font-bold text-primary dark:text-primary-300">
                  {profileForm.firstName?.[0] ||
                    user?.email?.[0]?.toUpperCase() ||
                    "U"}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {profileForm.firstName} {profileForm.lastName}
                </p>
                <p className="text-xs text-gray-500 capitalize dark:text-gray-400">
                  {user?.role}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center w-full gap-2 px-4 py-2 text-sm font-medium text-red-600 transition-colors rounded-lg bg-red-50 dark:bg-red-900/20 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30"
            >
              <FiTrash2 className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="p-6 bg-white border border-gray-100 shadow-sm dark:bg-dark-card rounded-xl dark:border-dark-border">
            {/* PROFILE TAB */}
            {activeTab === "profile" && (
              <form onSubmit={handleSaveProfile}>
                <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
                  Profile Information
                </h2>

                {/* Profile Image Upload */}
                <div className="flex items-center gap-6 mb-8">
                  <div className="relative">
                    <div className="flex items-center justify-center w-24 h-24 overflow-hidden rounded-full bg-primary-100 dark:bg-primary-900/20">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Profile"
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <span className="text-3xl font-bold text-primary dark:text-primary-300">
                          {profileForm.firstName?.[0] || "U"}
                        </span>
                      )}
                    </div>
                    <label
                      htmlFor="profile-image"
                      className="absolute bottom-0 right-0 flex items-center justify-center w-8 h-8 text-white transition-colors rounded-full cursor-pointer bg-primary hover:bg-primary-dark"
                    >
                      <FiCamera className="w-4 h-4" />
                    </label>
                    <input
                      type="file"
                      id="profile-image"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>

                  <div>
                    <p className="mb-1 text-sm font-medium text-gray-900 dark:text-white">
                      Profile Photo
                    </p>
                    <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                      PNG, JPG or GIF. Max 2MB.
                    </p>
                    {imagePreview && (
                      <button
                        type="button"
                        onClick={handleImageRemove}
                        className="text-sm text-red-500 hover:text-red-600"
                      >
                        Remove photo
                      </button>
                    )}
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={profileForm.firstName}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={profileForm.lastName}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email Address
                    </label>
                    <div className="relative">
                      <FiMail className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                      <input
                        type="email"
                        name="email"
                        value={profileForm.email}
                        onChange={handleProfileChange}
                        disabled
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg bg-gray-50 dark:bg-dark-bg text-gray-500 dark:text-gray-400 cursor-not-allowed"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Email cannot be changed
                    </p>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Phone Number
                    </label>
                    <div className="relative">
                      <FiPhone className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                      <input
                        type="tel"
                        name="phone"
                        value={profileForm.phone}
                        onChange={handleProfileChange}
                        placeholder="+1234567890"
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Department (for teachers) */}
                  {user?.role === "teacher" && (
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Department
                      </label>
                      <input
                        type="text"
                        name="department"
                        value={profileForm.department}
                        onChange={handleProfileChange}
                        placeholder="e.g., Computer Science"
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  )}

                  <div className="md:col-span-2">
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Address
                    </label>
                    <div className="relative">
                      <FiMapPin className="absolute text-gray-400 left-3 top-3" />
                      <textarea
                        name="address"
                        value={profileForm.address}
                        onChange={handleProfileChange}
                        rows="3"
                        placeholder="Enter your address"
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-6 mt-8 border-t border-gray-200 dark:border-dark-border">
                  <Button
                    type="submit"
                    disabled={profileLoading}
                    className="flex items-center gap-2"
                  >
                    {profileLoading ? (
                      <>
                        <svg
                          className="w-4 h-4 animate-spin"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>
                        <FiSave className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}

            {/* PASSWORD TAB */}
            {activeTab === "password" && (
              <form onSubmit={handleChangePassword}>
                <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
                  Change Password
                </h2>

                <div className="max-w-md space-y-6">
                  {/* Current Password */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Current Password
                    </label>
                    <div className="relative">
                      <FiLock className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                      <input
                        type={showPasswords.current ? "text" : "password"}
                        name="currentPassword"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordChange}
                        required
                        className="w-full pl-10 pr-12 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("current")}
                        className="absolute text-gray-400 -translate-y-1/2 right-3 top-1/2 hover:text-gray-600"
                      >
                        {showPasswords.current ? (
                          <FiEyeOff className="w-5 h-5" />
                        ) : (
                          <FiEye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      New Password
                    </label>
                    <div className="relative">
                      <FiLock className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                      <input
                        type={showPasswords.new ? "text" : "password"}
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                        required
                        minLength="6"
                        className="w-full pl-10 pr-12 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("new")}
                        className="absolute text-gray-400 -translate-y-1/2 right-3 top-1/2 hover:text-gray-600"
                      >
                        {showPasswords.new ? (
                          <FiEyeOff className="w-5 h-5" />
                        ) : (
                          <FiEye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Minimum 6 characters
                    </p>
                  </div>

                  {/* Confirm New Password */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <FiLock className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                      <input
                        type={showPasswords.confirm ? "text" : "password"}
                        name="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                        className="w-full pl-10 pr-12 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("confirm")}
                        className="absolute text-gray-400 -translate-y-1/2 right-3 top-1/2 hover:text-gray-600"
                      >
                        {showPasswords.confirm ? (
                          <FiEyeOff className="w-5 h-5" />
                        ) : (
                          <FiEye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Password Requirements */}
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-dark-bg">
                    <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Password Requirements:
                    </p>
                    <ul className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
                      <li
                        className={
                          passwordForm.newPassword.length >= 6
                            ? "text-green-500"
                            : ""
                        }
                      >
                        ✓ At least 6 characters
                      </li>
                      <li
                        className={
                          passwordForm.newPassword !==
                            passwordForm.confirmPassword ||
                          passwordForm.confirmPassword === ""
                            ? ""
                            : "text-green-500"
                        }
                      >
                        ✓ Passwords match
                      </li>
                    </ul>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={passwordLoading}
                      className="flex items-center gap-2"
                    >
                      {passwordLoading ? "Changing..." : "Change Password"}
                    </Button>
                  </div>
                </div>
              </form>
            )}

            {/* NOTIFICATIONS TAB */}
            {activeTab === "notifications" && (
              <form onSubmit={handleSaveNotifications}>
                <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
                  Notification Preferences
                </h2>

                <div className="space-y-6">
                  {/* Delivery Methods */}
                  <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                      Delivery Methods
                    </h3>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between p-4 rounded-lg cursor-pointer bg-gray-50 dark:bg-dark-bg">
                        <div className="flex items-center gap-3">
                          <FiMail className="w-5 h-5 text-primary" />
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              Email Notifications
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Receive updates via email
                            </p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          name="emailNotifications"
                          checked={notificationPrefs.emailNotifications}
                          onChange={handleNotificationChange}
                          className="w-4 h-4 text-primary focus:ring-primary"
                        />
                      </label>

                      <label className="flex items-center justify-between p-4 rounded-lg cursor-pointer bg-gray-50 dark:bg-dark-bg">
                        <div className="flex items-center gap-3">
                          <FiSmartphone className="w-5 h-5 text-primary" />
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              SMS Notifications
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Receive updates via text message
                            </p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          name="smsNotifications"
                          checked={notificationPrefs.smsNotifications}
                          onChange={handleNotificationChange}
                          className="w-4 h-4 text-primary focus:ring-primary"
                        />
                      </label>

                      <label className="flex items-center justify-between p-4 rounded-lg cursor-pointer bg-gray-50 dark:bg-dark-bg">
                        <div className="flex items-center gap-3">
                          <FiGlobe className="w-5 h-5 text-primary" />
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              Push Notifications
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Receive in-app push notifications
                            </p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          name="pushNotifications"
                          checked={notificationPrefs.pushNotifications}
                          onChange={handleNotificationChange}
                          className="w-4 h-4 text-primary focus:ring-primary"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Notification Types */}
                  <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                      Notification Types
                    </h3>
                    <div className="space-y-3">
                      {[
                        {
                          key: "attendanceAlerts",
                          label: "Attendance Alerts",
                          desc: "When your attendance is marked",
                        },
                        {
                          key: "gradeAlerts",
                          label: "Grade Alerts",
                          desc: "When new grades are published",
                        },
                        {
                          key: "feeAlerts",
                          label: "Fee Alerts",
                          desc: "Payment reminders and updates",
                        },
                        {
                          key: "courseUpdates",
                          label: "Course Updates",
                          desc: "Changes to your enrolled courses",
                        },
                        {
                          key: "systemAnnouncements",
                          label: "System Announcements",
                          desc: "Important system-wide announcements",
                        },
                      ].map((item) => (
                        <label
                          key={item.key}
                          className="flex items-center justify-between p-4 rounded-lg cursor-pointer bg-gray-50 dark:bg-dark-bg"
                        >
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {item.label}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {item.desc}
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            name={item.key}
                            checked={notificationPrefs[item.key]}
                            onChange={handleNotificationChange}
                            className="w-4 h-4 text-primary focus:ring-primary"
                          />
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-dark-border">
                    <Button
                      type="submit"
                      disabled={notificationLoading}
                      className="flex items-center gap-2"
                    >
                      {notificationLoading ? "Saving..." : "Save Preferences"}
                    </Button>
                  </div>
                </div>
              </form>
            )}

            {/* APPEARANCE TAB */}
            {activeTab === "appearance" && (
              <div>
                <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
                  Appearance Settings
                </h2>

                <div className="space-y-6">
                  {/* Theme Selection */}
                  <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                      Theme
                    </h3>

                    <div className="grid max-w-md grid-cols-2 gap-4">
                      {/* Light Theme */}
                      <button
                        onClick={() => darkMode && toggleTheme()}
                        className={`p-4 rounded-xl border-2 transition-colors ${
                          !darkMode
                            ? "border-primary bg-primary-50 dark:bg-primary-900/20"
                            : "border-gray-200 dark:border-dark-border hover:border-primary"
                        }`}
                      >
                        <div className="p-4 mb-3 bg-white rounded-lg shadow-sm">
                          <div className="h-2 mb-2 bg-gray-100 rounded"></div>
                          <div className="w-3/4 h-2 mb-2 bg-gray-200 rounded"></div>
                          <div className="w-1/2 h-2 bg-gray-100 rounded"></div>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                          <FiSun className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            Light
                          </span>
                        </div>
                      </button>

                      {/* Dark Theme */}
                      <button
                        onClick={() => !darkMode && toggleTheme()}
                        className={`p-4 rounded-xl border-2 transition-colors ${
                          darkMode
                            ? "border-primary bg-primary-50 dark:bg-primary-900/20"
                            : "border-gray-200 dark:border-dark-border hover:border-primary"
                        }`}
                      >
                        <div className="p-4 mb-3 bg-gray-900 rounded-lg shadow-sm">
                          <div className="h-2 mb-2 bg-gray-700 rounded"></div>
                          <div className="w-3/4 h-2 mb-2 bg-gray-600 rounded"></div>
                          <div className="w-1/2 h-2 bg-gray-700 rounded"></div>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                          <FiMoon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            Dark
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Language Selection */}
                  <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                      Language
                    </h3>
                    <select
                      className="max-w-md w-full px-4 py-2.5 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary"
                      defaultValue="en"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="am">Amharic</option>
                    </select>
                  </div>

                  {/* Accessibility */}
                  <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
                      Accessibility
                    </h3>
                    <div className="max-w-md space-y-3">
                      <label className="flex items-center justify-between p-4 rounded-lg cursor-pointer bg-gray-50 dark:bg-dark-bg">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Reduce Motion
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Minimize animations throughout the app
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-primary focus:ring-primary"
                        />
                      </label>

                      <label className="flex items-center justify-between p-4 rounded-lg cursor-pointer bg-gray-50 dark:bg-dark-bg">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            High Contrast
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Increase contrast for better readability
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-primary focus:ring-primary"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-dark-border">
                    <Button className="flex items-center gap-2">
                      <FiSave className="w-4 h-4" />
                      Save Preferences
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
