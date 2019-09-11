# firebase target:apply hosting harmony-puzzle1 harmony-puzzle1
echo "I assumed you already built (npm run build) before this pushing"
firebase deploy --only hosting:harmony-puzzle1
