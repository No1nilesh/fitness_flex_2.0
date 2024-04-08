import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

const memPlanFormDataStore = (set) => ({
  memPlan: {
    _id: "",
    name: "",
    description: "",
    durationValue: "",
    features: [],
    durationUnit: "",
    price: "",
    stripeProductId: "",
    planId: "",
  },

  setMemPlanFormData: (plan) =>
    set({
      memPlan: {
        _id: plan._id,
        name: plan.name,
        description: plan.description,
        durationValue: plan.durationValue,
        features: plan.features,
        durationUnit: plan.durationUnit,
        price: plan.price,
        stripeProductId: plan.stripeProductId,
        planId: plan.planId,
      },
    }),
});

const useMembershipPlanFormDataStore = create(
  devtools(
    persist(memPlanFormDataStore, {
      name: "memPlanFormData",
    })
  )
);

export default useMembershipPlanFormDataStore;
