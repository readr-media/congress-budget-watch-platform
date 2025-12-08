import { graphql } from "~/graphql";

export const GET_RECOGNITION_STATS_QUERY = graphql(`
  query RecognitionImages {
    recognitionImages(where: { verificationStatus: { equals: "verified" } }) {
      result
    }
    recognitionImagesCount
  }
`);
