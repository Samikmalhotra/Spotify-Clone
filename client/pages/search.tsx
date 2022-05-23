import { Box } from "@chakra-ui/layout";
import { Button, Input } from "@chakra-ui/react";
import { useState } from "react";
import GradientLayout from "../components/gradientLayout";
import { useMe } from "../lib/hooks";
import axios from "axios";
import SongTable from "../components/songTable";

const Search = () => {
  const { user } = useMe();

  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  console.log(search);

  const changeHandler = async (search) => {
    setSearch(search);
  };

  const clickHandler = async () => {
    setLoading(true);

    const body = {
      songData: `${search}`,
    };

    try {
      const res = await axios.post(
        `${window.location.origin}/api/search`,
        body
      );
      console.log(res.data);
      setResults(res.data);
      setLoading(false);
    } catch (error) {
      setError(error.response.data.error);
      setLoading(false);
    }
  };

  return (
    <GradientLayout
      roundImage
      color="blue"
      subtitle="library"
      // @ts-ignore
      title={`${user?.firstName} ${user?.lastName}`}
      description={`${user?.playlistsCount} public playlists`}
      image={`https://picsum.photos/seed/picsum${Math.floor(
        Math.random() * 400
      )}/400`}
    >
      <Box>
        <Input
          padding="30px"
          margin="30px"
          width="70%"
          marginLeft="50px"
          bgColor="black"
          border="none"
          color="white"
          onChange={(e) => {
            e.preventDefault;
            changeHandler(e.target.value);
          }}
        />
        <Button isLoading={loading} onClick={clickHandler}>
          Search
        </Button>
        {error ? <h4>No Songs found</h4> : <SongTable songs={results} />}
      </Box>
    </GradientLayout>
  );
};

export default Search;
