COPY (SELECT ratings.user_nid, ratings.show_nid, ratings.rating
FROM
  ratings JOIN users ON users.nid = ratings.user_nid
  JOIN shows ON shows.nid = ratings.show_nid)
TO
'/tmp/psql_rip.csv'
DELIMITER ','
CSV HEADER