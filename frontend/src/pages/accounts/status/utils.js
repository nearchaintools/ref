export const getIdentityForPayouts = (props) => {
  const { paidBy } = props;
  if (!paidBy) return;
  const { identity } = paidBy;
  if (!identity) return;
  let result = identity.display;
  if (identity.displayParent) {
    result = `${identity.displayParent}/${identity.display}`;
  }
  return result;
};

export const getIdentity = ({ identity }) => {
  if (!identity) return;
  let result = identity.display;
  if (identity.displayParent) {
    result = `${identity.displayParent}/${identity.display}`;
  }
  return result;
};
