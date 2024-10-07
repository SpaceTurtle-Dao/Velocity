export interface ReactionDetails {
       postKey: string;
       relaykey: string;
       // tags: string[][];
       kind: number; // 7
       content: string | null;
       emoji: string | null; // "👍" ":thumbsUp:"
       emojiTags: string[] | null;
}

export const createReaction = (reaction: ReactionDetails) => {
       // let tags: string[][] = reaction.tags.filter(tag => tag.length >= 2 && (tag[0] === "e" || tag[0] === "p"));
       let tags: string[][] = [];
       tags.push(["e", reaction.postKey]);
       tags.push(["p", reaction.relaykey]);
       tags.push(["k", reaction.kind.toString()]);
       if (reaction.emoji && reaction.emojiTags) {
              tags.push(reaction.emojiTags);
              return {
                     kind: 7,
                     content: reaction.emoji,
                     tags: tags,
              };
       }
       return {
              kind: 7,
              tags: tags,
       };
}