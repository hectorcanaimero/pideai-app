import { renderHook, waitFor, act } from "@testing-library/react-native";
import { createElement, type ReactNode } from "react";
import { supabase } from "@/services/supabase";

jest.mock("@/lib/sentry", () => ({
  setUserContext: jest.fn(),
  clearUserContext: jest.fn(),
}));

import { AuthProvider, useAuthContext } from "@/contexts/AuthContext";

function createWrapper() {
  return ({ children }: { children: ReactNode }) =>
    createElement(AuthProvider, null, children);
}

describe("AuthContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: null },
    });
  });

  it("starts with loading true and no user", async () => {
    const { result } = renderHook(() => useAuthContext(), { wrapper: createWrapper() });

    expect(result.current.loading).toBe(true);
    expect(result.current.user).toBeNull();
    expect(result.current.session).toBeNull();

    await waitFor(() => expect(result.current.loading).toBe(false));
  });

  it("loads existing session on mount", async () => {
    const mockSession = {
      user: { id: "user-1", email: "test@test.com" },
      access_token: "token-123",
    };

    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: mockSession },
    });

    const { result } = renderHook(() => useAuthContext(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.user?.id).toBe("user-1");
    expect(result.current.session).toBeTruthy();
  });

  it("signIn calls supabase auth", async () => {
    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
      data: { session: { user: { id: "user-1" } } },
      error: null,
    });

    const { result } = renderHook(() => useAuthContext(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.loading).toBe(false));

    let signInResult: { error: Error | null } | undefined;
    await act(async () => {
      signInResult = await result.current.signIn("test@test.com", "password123");
    });

    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: "test@test.com",
      password: "password123",
    });
    expect(signInResult?.error).toBeNull();
  });

  it("signIn returns error on failure", async () => {
    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
      data: { session: null },
      error: { message: "Invalid credentials" },
    });

    const { result } = renderHook(() => useAuthContext(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.loading).toBe(false));

    let signInResult: { error: Error | null } | undefined;
    await act(async () => {
      signInResult = await result.current.signIn("bad@test.com", "wrong");
    });

    expect(signInResult?.error).toBeInstanceOf(Error);
    expect(signInResult?.error?.message).toBe("Invalid credentials");
  });

  it("signOut clears session", async () => {
    (supabase.auth.signOut as jest.Mock).mockResolvedValue({ error: null });

    const mockSession = {
      user: { id: "user-1", email: "test@test.com" },
      access_token: "token-123",
    };

    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: mockSession },
    });

    const { result } = renderHook(() => useAuthContext(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.user).toBeTruthy());

    await act(async () => {
      await result.current.signOut();
    });

    expect(supabase.auth.signOut).toHaveBeenCalled();
    expect(result.current.session).toBeNull();
  });

  it("subscribes to auth state changes", () => {
    renderHook(() => useAuthContext(), { wrapper: createWrapper() });
    expect(supabase.auth.onAuthStateChange).toHaveBeenCalled();
  });
});
