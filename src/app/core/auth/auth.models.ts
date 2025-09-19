export interface RealmAccess {
  roles: string[];
}

export interface ClientAccess {
  roles: string[];
}

export type ResourceAccess = Record<string, ClientAccess | undefined>;

export interface KeycloakUserData {
  realm_access?: RealmAccess;
  resource_access?: ResourceAccess;
  preferred_username?: string;
  name?: string;
  email?: string;
}
