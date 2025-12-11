import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

export const statement = {
  ...defaultStatements,
  // Add other resource permissions here if needed
} as const;

export const ac = createAccessControl(statement);

export const superAdmin = ac.newRole({
  ...adminAc.statements,
});

export const utility = ac.newRole({
  ...adminAc.statements,
});

export const admin = ac.newRole({
  ...adminAc.statements,
});

export const user = ac.newRole({});
