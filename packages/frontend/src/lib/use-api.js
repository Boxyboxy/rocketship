import * as React from "react";
import axios from "axios";
function initialState(args) {
  return {
    response: null,
    error: null,
    isLoading: true,
    ...args,
  };
}

const useApi = (url, requestType, data) => {
  const [state, setState] = React.useState(() => initialState({}));

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        // const res = await fetch(url, {
        //   ...options,
        // });
        console.log(requestType);

        const res = await axios({
          url,
          responseType: "json",
          headers: {
            "Content-Type": "application/json",
          },
          method: requestType,
          data: data,
        });
        if (res.status >= 400) {
          setState(
            initialState({
              error: res,
              isLoading: false,
            })
          );
        } else {
          console.log(res);
          setState(
            initialState({
              response: res,
              isLoading: false,
            })
          );
        }
      } catch (error) {
        setState(
          initialState({
            error: {
              error: error.message,
            },
            isLoading: false,
          })
        );
      }
    };
    fetchData();
  }, []);
  return state;
};

export default useApi;
