import { Spinner } from "@chakra-ui/react";

const LoaderComponent = () => {
  return (
    <div
      style={{
        minHeight: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="#038a64"
          size="xl"
        />
      </div>
    </div>
  );
};

export default LoaderComponent;
