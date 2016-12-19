library('ggplot2')
library('dplyr')
library('Matrix')
library('irlba')
df = read.csv("/home/richard/myanimelist/psql_rip.csv")
data.sparse = sparseMatrix(
  i = df$user_nid,
  j = df$show_nid,
  x = df$rating
)

colnames(data.sparse) = seq_len(ncol(data.sparse))
rownames(data.sparse) = seq_len(nrow(data.sparse))

USER_LIMIT = 20
SHOW_LIMIT = 15
# purge all the completely 0 entries
data.sparse = data.sparse[rowSums(data.sparse!=0) > USER_LIMIT, colSums(data.sparse!=0) > SHOW_LIMIT]
data.filled = as.matrix(data.sparse)

# replace all 0s with the column mean
data.filled[data.filled == 0] = NA
for (i in seq_len(ncol(data.filled))){
  data.filled[is.na(data.filled[,i]), i] = mean(data.filled[,i], na.rm = TRUE)
}

data.show.means = colMeans(data.filled, na.rm=TRUE)
data.user.means = rowMeans(data.filled, na.rm=TRUE)

# perform svd
svd_mod = irlba(data.filled, center = data.show.means, nv=200)

# save the svd model
saveRDS(svd_mod, 'svd.rds')

