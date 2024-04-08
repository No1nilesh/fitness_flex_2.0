import { useEffect, useState } from "react";
export const useMembershipPlan = () => {
  const [memPlans, setMemPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchMembershipPlans = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/membership_plans");
        const data = await res.json();
        setMemPlans(data);
      } catch (error) {
        console.error("Error fetching membership plans:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembershipPlans();
  }, []);

  return {
    memPlans,
    loading,
  };
};
