import { createComment } from "@/api/actions/commentActions";
import { createSlice } from "@reduxjs/toolkit";

interface Comment {
  id: number;
  text: string;
  createdAt: string;
}

interface CommentState {
  commentsByExhibit: Record<number, Comment[]>;
  activeExhibitId: number | null;
  loading: boolean;
  error: string | null;
}

const initialState: CommentState = {
  commentsByExhibit: {},
  activeExhibitId: null,
  loading: false,
  error: null,
};

const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    openCommentModal: (state, action) => {
      state.activeExhibitId = action.payload;
    },
    closeCommentModal: (state) => {
      state.activeExhibitId = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createComment.fulfilled, (state, action) => {
      const newComment = action.payload;
      const exhibitId = newComment.exhibitId;

      if (state.commentsByExhibit[exhibitId]) {
        state.commentsByExhibit[exhibitId].push(newComment);
      } else {
        state.commentsByExhibit[exhibitId] = [newComment];
      }
    });
  },
});

export const { openCommentModal, closeCommentModal } = commentSlice.actions;
export default commentSlice.reducer;
