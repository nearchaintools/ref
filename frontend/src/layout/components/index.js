import Typography from "@material-ui/core/Typography";
import { TextField, Link } from "@material-ui/core";
import * as ChartsComponents from "./charts";
import ChimpComponent from "./chimp";
import { useRecordContext } from "react-admin";

export const Charts = ChartsComponents;
export const Chimp = ChimpComponent;

export const VerticalSpacer = () => <span style={{ height: "1em" }} />;

export const Spacer = () => <span style={{ width: "1em" }} />;

export const Loading = () => (
  <Typography component="span">Loading...</Typography>
);

export const NoData = () => (
  <Typography component="span">No data found</Typography>
);

export const Error = ({ message }) => (
  <Typography component="span" style="color: red">
    {message}
  </Typography>
);

export const SimpleTextField = (props) => {
  const { name, label, onChange, ...rest } = props;
  return <TextField name={name} label={label} onChange={onChange} {...rest} />;
};

export const AccountUrlField = (props) => {
  const record = useRecordContext(props);
  const { url } = props;
  const fullUrl = `${url}${record.accountId}`;

  return (
    <Link href={fullUrl} target="_new">
      {record.accountId}
    </Link>
  );
};

AccountUrlField.defaultProps = { label: "Account", addLabel: true };
