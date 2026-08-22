import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchBy: "",
  statusBy: "",
  domain: "",
  pkgType: "",
  affiliateCode: "",
  frequencie: "",
  planPrice: 0,
  planOldPrice: 0,
  planKey: "",
};

export const onboardSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    searchByOnboard: (state, action) => {
      state.searchBy = action.payload;
    },
    verifyOnboard: (state, action) => {
      state.statusBy = action.payload;
    },
    selectedDomain: (state, action) => {
      state.domain = action.payload;
    },
    selectedPackage: (state, action) => {
      state.pkgType = action.payload;
    },
    addAffiliateCode: (state, action) => {
      state.affiliateCode = action.payload;
    },
    selectFrequency: (state, action) => {
      state.frequencie = action.payload;
    },
    selectPlanPrice: (state, action) => {
      state.planPrice = action.payload;
    },
    selectPlanOldPrice: (state, action) => {
      state.planOldPrice = action.payload;
    },
    selectPlanKey: (state, action) => {
      state.planKey = action.payload;
    },
  },
});

export default onboardSlice.reducer;
export const {
  searchByOnboard,
  verifyOnboard,
  selectedDomain,
  selectedPackage,
  addAffiliateCode,
  selectFrequency,
  selectPlanPrice,
  selectPlanOldPrice,
  selectPlanKey,
} = onboardSlice.actions;
