"use client";

import {
  Button,
  Container,
  FormControl,
  Grid,
  IconButton,
  TextField,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { SetStateAction, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Home() {
  const searchParam = useSearchParams();
  const router = useRouter();
  const [userName, setUserName] = useState("");

  const setFormData = (e: { target: { value: SetStateAction<string> } }) => {
    setUserName(e.target.value);
  };

  // sends username to info/[user] page using query params
  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    router.push(`/info/${userName}`);
  };

  return (
    <>
      <Container>
        <h1>GitStats</h1>
        <FormControl onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Enter a GitHub username to search....."
            id="github_username"
            onChange={setFormData}
          />
          <Button
            type="submit"
            color="primary"
            variant="contained"
            onClick={handleSubmit}
          >
            <SendIcon />
          </Button>
        </FormControl>
      </Container>
    </>
  );
}
