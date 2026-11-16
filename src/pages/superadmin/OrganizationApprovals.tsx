import toast from "react-hot-toast";
import {
  useListPendingOrganizationsQuery,
  useApproveOrganizationMutation,
  useRejectOrganizationMutation,
} from "../../services/api";

const OrganizationApprovals = () => {
  const { data, isLoading, isError } = useListPendingOrganizationsQuery();
  const [approve, { isLoading: approving }] = useApproveOrganizationMutation();
  const [reject, { isLoading: rejecting }] = useRejectOrganizationMutation();

  const handleApprove = async (id: number, name: string) => {
    try {
      const res = await approve(id).unwrap();
      toast.success(`"${name}" approved — code: ${res.data.organization_code}`);
    } catch (e: any) {
      toast.error(e?.data?.message || "Approval failed");
    }
  };

  const handleReject = async (id: number, name: string) => {
    const reason =
      window.prompt(`Reason for rejecting "${name}" (optional):`) || undefined;
    try {
      await reject({ id, reason }).unwrap();
      toast.success(`"${name}" rejected`);
    } catch (e: any) {
      toast.error(e?.data?.message || "Rejection failed");
    }
  };

  if (isLoading) return <p className="p-8">Loading pending organizations...</p>;
  if (isError)
    return <p className="p-8 text-red-600">Failed to load organizations.</p>;

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">
        Pending Organization Approvals
      </h1>

      {!data?.length ? (
        <p className="text-gray-500">No pending registrations.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "Organization",
                  "Contact",
                  "Email",
                  "Phone",
                  "Requested",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map((org) => (
                <tr key={org.id}>
                  <td className="px-4 py-3">{org.name}</td>
                  <td className="px-4 py-3">{org.contact_person}</td>
                  <td className="px-4 py-3">{org.email}</td>
                  <td className="px-4 py-3">{org.phone || "—"}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(org.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 space-x-2">
                    <button
                      disabled={approving || rejecting}
                      onClick={() => handleApprove(org.id, org.name)}
                      className="px-3 py-1 rounded bg-green-600 text-white text-sm hover:bg-green-700 disabled:opacity-50"
                    >
                      Approve
                    </button>
                    <button
                      disabled={approving || rejecting}
                      onClick={() => handleReject(org.id, org.name)}
                      className="px-3 py-1 rounded bg-red-600 text-white text-sm hover:bg-red-700 disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrganizationApprovals;
