import { useEffect, useState } from "react";
import { User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { profile, getMyOrganization, createOrganization } from "../lib/api";

export default function Profile() {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [organization, setOrganization] = useState<any>(null);
  const [hasOrg, setHasOrg] = useState<boolean>(false);
  const [orgName, setOrgName] = useState("");
  const [loadingOrg, setLoadingOrg] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await profile();
    console.log(response.data);
  };

  const handleCreateOrg = async () => {
    if (!orgName.trim()) {
      alert("Please enter an organization name");
      return;
    }

    try {
      const response = await createOrganization({ name: orgName });
      console.log("Organization created:", response.data);
      setOrganization(response.data);
      setHasOrg(true);
      setOrgName("");
      alert("Organization created successfully!");
    } catch (error) {
      console.error("Error creating organization:", error);
      alert("Failed to create organization");
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await profile();
        console.log("Profile:", response.data);
        setName(response.data.name);
        setEmail(response.data.email);
      } catch (error) {
        console.error("Error Profile:", error);
      }
    };

    const fetchOrganization = async () => {
      try {
        const response = await getMyOrganization();
        console.log("Organization:", response.data);
        setOrganization(response.data);
        setHasOrg(true);
      } catch (error) {
        console.error("No organization found:", error);
        setHasOrg(false);
      } finally {
        setLoadingOrg(false);
      }
    };

    fetchProfile();
    fetchOrganization();
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{t("profile.title")}</h1>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="bg-gray-100 p-3 rounded-full">
            <User className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">
              {t("profile.personalInfo")}
            </h2>
            <p className="text-gray-600">{t("profile.updateInfo")}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("profile.name")}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("profile.email")}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Organization Section */}
          <div className="pt-6 border-t">
            <h3 className="text-lg font-medium mb-4">Organization</h3>

            {loadingOrg ? (
              <p className="text-gray-600">Loading organization...</p>
            ) : hasOrg ? (
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-600">Organization Name</p>
                <p className="text-lg font-semibold">{organization?.name}</p>
                <p className="text-sm text-gray-600 mt-2">Your Role</p>
                <p className="text-lg font-semibold capitalize">
                  {organization?.role}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-600">
                  You don't have an organization yet.
                </p>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Organization Name
                  </label>
                  <input
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder="Enter organization name"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleCreateOrg}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  Create Organization
                </button>
              </div>
            )}
          </div>

          <div className="pt-6 border-t">
            <h3 className="text-lg font-medium mb-4">
              {t("profile.changePassword")}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("profile.currentPassword")}
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("profile.newPassword")}
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              {t("profile.saveChanges")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}