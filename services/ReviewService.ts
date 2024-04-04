import fs from "fs";

import { JWT } from "google-auth-library";
import { google } from "googleapis";
import { Review, ReviewState } from "../types";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

import androidpublisher_v3 from "googleapis/build/src/apis/androidpublisher/v3";

class ReviewService {
  callback?: (reviews: Review[]) => void;

  jwtClient: JWT;
  googleClient?: androidpublisher_v3.androidpublisher_v3.Androidpublisher;
  supabaseClient: SupabaseClient;

  constructor() {
    const publisherData = fs.readFileSync("./playstore.json", "utf8");
    const publisherJson = JSON.parse(publisherData);

    this.jwtClient = new google.auth.JWT(
      publisherJson.client_id,
      undefined,
      publisherJson.private_key,
      ["https://www.googleapis.com/auth/androidpublisher"]
    );

    // Create a new supabase client
    this.supabaseClient = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_KEY!
    );
  }

  private async fetchReviews(app = "com.sjorsvanholst.uwuifier") {
    // Fetch the latest reviews from the PlayStore
    const latestReviews = await this.googleClient!.reviews.list({
      packageName: app,
    });

    // Filter out reviews without comments
    const latestFiltered = latestReviews.data.reviews!.filter(
      (review) => review.comments![0].userComment && review.reviewId
    );

    const latestIds = latestFiltered.map((review) => review.reviewId);

    // Check if the review already exists in the database
    const existingReviews = await this.supabaseClient
      .from("reviews")
      .select("id")
      .in("id", latestIds);

    const existingIds = existingReviews.data!.map((review) => review.id);

    // Filter out the reviews that already exist
    const newReviews = latestReviews.data.reviews!.filter(
      (review) => !existingIds.includes(review.reviewId)
    );

    const mappedReviews = newReviews.map((review) => {
      const comment = review.comments![0].userComment!;

      return {
        id: review.reviewId!,
        state: ReviewState.AI_PENDING,
        package: app,
        review: comment.text!,
        rating: comment.starRating!,
        response: review.comments![1]?.developerComment?.text || "",
      };
    });

    this.callback?.(mappedReviews);
  }

  async connect() {
    // Ensure JWT is authorized
    await this.jwtClient.authorize();

    this.googleClient = google.androidpublisher({
      version: "v3",
      auth: this.jwtClient,
    });

    // Fetch reviews every hour
    setInterval(this.fetchReviews.bind(this), 3600000);
  }

  async replyReview(review: Review) {
    // Reply to the review through the PlayStore API
    await this.googleClient!.reviews.reply({
      packageName: review.package,
      reviewId: review.id,
      requestBody: {
        replyText: review.response,
      },
    });
  }
}

export default ReviewService;
