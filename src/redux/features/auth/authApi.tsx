import type { TemplateType, UserDataType } from "../../../utils/user.types";
import { apiSlice } from "../../app/api";

type ResponseType = {
  status: string;
  message: string;
  user?: Record<string, unknown>;
};

type SettingType = {
  status: string;
  message: string;
  setting: {
    maintenance: boolean;
  };
};

interface UserType {
  users: UserDataType[];
  templates: TemplateType[];
}

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllUser: builder.query({
      query: ({ page, limit, searchBy, statusBy }) => ({
        url: `/api/auth?page=${page}&limit=${limit}&searchBy=${searchBy}&statusBy=${statusBy}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["update"],
    }),
    getAllUserByAdmin: builder.query<UserType, void>({
      query: () => ({
        url: `/api/auth/admin`,
        method: "GET",
        headers: {
          "x-api-key": import.meta.env.VITE_APP_PUBLIC_API_KEY,
        },
      }),
      providesTags: ["update"],
    }),

    getOneUser: builder.query({
      query: (id) => ({
        url: `/api/auth/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["update", "LoggedUser"],
    }),
    getSetting: builder.query<SettingType, void>({
      query: () => ({
        url: `/api/auth/admin/setting`,
        method: "GET",
        headers: {
          "x-api-key": import.meta.env.VITE_APP_PUBLIC_API_KEY,
        },
      }),
      providesTags: ["update", "LoggedUser"],
    }),
    getOneUserByLandername: builder.query({
      query: (name) => ({
        url: `/api/auth/affiliate/${name}`,
        method: "GET",
        headers: {
          "x-api-key": import.meta.env.VITE_APP_PUBLIC_API_KEY,
        },
      }),
      providesTags: ["update", "LoggedUser"],
    }),

    register: builder.mutation({
      query: (user) => ({
        url: "/api/auth/register",
        method: "POST",
        body: user,
        headers: {
          "x-api-key": import.meta.env.VITE_APP_PUBLIC_API_KEY,
        },
      }),
    }),
    findLandername: builder.mutation({
      query: (user) => ({
        url: "/api/auth/find",
        method: "POST",
        body: user,
        headers: {
          "x-api-key": import.meta.env.VITE_APP_PUBLIC_API_KEY,
        },
      }),
    }),
    login: builder.mutation({
      query: (user) => ({
        url: "/api/auth/login",
        method: "POST",
        body: user,
        headers: {
          "x-api-key": import.meta.env.VITE_APP_PUBLIC_API_KEY,
        },
      }),
      invalidatesTags: ["LoggedUser"],
    }),
    adminLogin: builder.mutation({
      query: (user) => ({
        url: "/api/auth/admin/login",
        method: "POST",
        body: user,
        headers: {
          "x-api-key": import.meta.env.VITE_APP_PUBLIC_API_KEY,
        },
      }),
      invalidatesTags: ["LoggedUser"],
    }),
    logout: builder.mutation({
      query: (user) => ({
        url: "/api/auth/logout",
        method: "POST",
        body: user,
        credentials: "include",
      }),
      invalidatesTags: ["LoggedUser"],
    }),
    loggedUser: builder.query<ResponseType, void>({
      query: () => ({
        url: "/api/auth/logged",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["LoggedUser"],
    }),

    verifyUser: builder.mutation({
      query: (user) => ({
        url: "/api/auth/verify",
        method: "POST",
        body: user,
        headers: {
          "x-api-key": import.meta.env.VITE_APP_PUBLIC_API_KEY,
        },
      }),
    }),
    verifyUserByAdmin: builder.mutation({
      query: (user) => ({
        url: "/api/auth/verify/admin",
        method: "PATCH",
        credentials: "include",
        body: user,
      }),
      invalidatesTags: ["update"],
    }),
    sendResetCode: builder.mutation({
      query: (user) => ({
        url: "/api/auth/send/code",
        method: "POST",
        body: user,
        headers: {
          "x-api-key": import.meta.env.VITE_APP_PUBLIC_API_KEY,
        },
      }),
    }),
    sendOtpCode: builder.mutation({
      query: (user) => ({
        url: "/api/auth/send/otp",
        method: "POST",
        body: user,
        headers: {
          "x-api-key": import.meta.env.VITE_APP_PUBLIC_API_KEY,
        },
      }),
    }),
    resetUser: builder.mutation({
      query: (user) => ({
        url: "/api/auth/reset",
        method: "POST",
        body: user,
        headers: {
          "x-api-key": import.meta.env.VITE_APP_PUBLIC_API_KEY,
        },
      }),
    }),
    updatePassword: builder.mutation({
      query: ({ user, id }) => ({
        url: `/api/auth/password/${id}`,
        method: "PATCH",
        body: user,
      }),
      invalidatesTags: ["LoggedUser"],
    }),
    updateUser: builder.mutation({
      query: ({ formData, id }) => ({
        url: `/api/auth/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["LoggedUser"],
    }),
    updateUserAddress: builder.mutation({
      query: ({ user, id }) => ({
        url: `/api/auth/update/address/${id}`,
        method: "PATCH",
        body: user,
        credentials: "include",
      }),
      invalidatesTags: ["LoggedUser"],
    }),
    updateAdmin: builder.mutation({
      query: ({ formData, id }) => ({
        url: `/api/auth/admin/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["LoggedUser"],
    }),
    updateMaintenance: builder.mutation({
      query: ({ user, id }) => ({
        url: `/api/auth/admin/setting/${id}`,
        method: "PATCH",
        body: user,
      }),
      invalidatesTags: ["LoggedUser"],
    }),
    updateUserByAdmin: builder.mutation({
      query: ({ formData, id }) => ({
        url: `/api/auth/admin/update/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["update"],
    }),
    toggleAccountActivation: builder.mutation({
      query: ({ id, user }) => ({
        url: `/api/auth/toggle/activation/${id}`,
        method: "PATCH",
        body: user,
      }),
      invalidatesTags: ["LoggedUser"],
    }),
    toggleDirectoryStatus: builder.mutation({
      query: ({ id, user }) => ({
        url: `/api/auth/directory/${id}`,
        method: "PATCH",
        body: user,
      }),
      invalidatesTags: ["LoggedUser"],
    }),
    togglebrandshareStatus: builder.mutation({
      query: ({ id, user }) => ({
        url: `/api/auth/brandshare/${id}`,
        method: "PATCH",
        body: user,
      }),
      invalidatesTags: ["LoggedUser"],
    }),
    updatePasswordByAdmin: builder.mutation({
      query: ({ id, user }) => ({
        url: `/api/auth/password/admin/${id}`,
        method: "PATCH",
        body: user,
      }),
      invalidatesTags: ["LoggedUser"],
    }),
    updateMembership: builder.mutation({
      query: ({ id, membership }) => ({
        url: `/api/auth/membership/${id}`,
        method: "PATCH",
        body: membership,
      }),
      invalidatesTags: ["LoggedUser"],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/api/auth/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["LoggedUser", "update"],
    }),
  }),
});

export const {
  useGetAllUserByAdminQuery,
  useGetAllUserQuery,
  useGetOneUserQuery,
  useRegisterMutation,
  useLoginMutation,
  useLoggedUserQuery,
  useLogoutMutation,
  useVerifyUserMutation,
  useSendResetCodeMutation,
  useSendOtpCodeMutation,
  useResetUserMutation,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useUpdatePasswordMutation,
  useAdminLoginMutation,
  useVerifyUserByAdminMutation,
  useToggleAccountActivationMutation,
  useUpdateUserByAdminMutation,
  useUpdatePasswordByAdminMutation,
  useUpdateMembershipMutation,
  useToggleDirectoryStatusMutation,
  useGetOneUserByLandernameQuery,
  useFindLandernameMutation,
  useUpdateAdminMutation,
  useUpdateMaintenanceMutation,
  useGetSettingQuery,
  useTogglebrandshareStatusMutation,
  useUpdateUserAddressMutation,
} = authApi;
