// GoogleButton.tsx
import styles from "./GoogleButton.module.css";
import GoogleIcon from "@/components/shared/icons/GoogleIcon/GoogleIcon";
import { useActionState } from "react";
import { googleAuthenticate } from "../../../../actions/auth/google-login";
import Button from "@/components/shared/Button/Button";

interface Props {
  title: string;
}

export default function GoogleButton({ title }: Props) {
  const [errorMsgGoogle, dispatchGoogle] = useActionState(
    googleAuthenticate,
    undefined
  );

  return (
    <form action={dispatchGoogle} className={styles.form}>
      <Button
        type='submit'
        btnType='goldBorder'
        text={`Sign ${title} with Google`}
        leftIcon={<GoogleIcon className={styles.google} />}
      />
      {errorMsgGoogle && <p className={styles.error}>{errorMsgGoogle}</p>}
    </form>
  );
}
