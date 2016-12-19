#!/usr/bin/env Rscript
library('jsonlite')

args = commandArgs(trailingOnly = TRUE)

# convert JSON arguments to a list
user_ratings = (fromJSON(args))

# load assets
svd_inv = readRDS("svd_inv.rds")
svd_mod = readRDS("svd.rds")
show_means = readRDS("show_means.rds")

# impute scores
user_input = show_means

# replace imputed scores with real ratings where valid
for (i in seq_len(length(user_ratings))){
  name_ind = match(names(user_ratings)[i], names(user_input))
  user_input[name_ind] = user_ratings[i]
}

# reconstruct user preferences in k-space
t = as.numeric(user_input) %*% svd_inv$inv_v %*% svd_inv$inv_d

# calculate and print the recommendations
output_recommendation = t %*% diag(svd_mod$d) %*% t(svd_mod$v)
names(output_recommendation) = names(show_means)
write(names(sort(output_recommendation, decreasing=TRUE)), stdout())
