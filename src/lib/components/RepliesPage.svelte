<script>
    //@ts-nocheck
    import { fetchReplies } from "$lib/ao/mememaker";
    export let memeId;
  
    let replies = [];
  
    fetchReplies("Wx88y46DYs_4CtT6mxzpegjA8lU0b9JPRRAV8hOBWzwp", '1', '100')
      .then(data => {
        replies = data;
        console.log(replies);
      });
  </script>
  
  <h1>{replies}</h1>
  