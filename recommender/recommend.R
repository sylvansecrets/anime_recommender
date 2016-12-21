#!/usr/bin/env Rscript
library('jsonlite')

args = commandArgs(trailingOnly = TRUE)

# extract path
current_dir = args[1]
  
# convert JSON arguments to a list
user_ratings = (fromJSON(args[2]))

# load assets
svd_inv = readRDS(file.path(current_dir, "svd_inv.rds"))
svd_mod = readRDS(file.path(current_dir, "svd.rds"))
show_means = readRDS(file.path(current_dir, "show_means.rds"))

# retain only non-zero user ratings
user_ratings = user_ratings[user_ratings != 0]
rownames(svd_inv$inv_v) = names(show_means)

# retain only shows that are in show_means
user_input = user_ratings[names(user_ratings) %in% names(show_means)]

# retain only rows of svd_inv$inv_v that are in user_ratings
svd_inv$inv_v = svd_inv$inv_v[rownames(svd_inv$inv_v) %in% names(user_input), ]

# reconstruct user preferences in k-space
t = as.numeric(user_input) %*% svd_inv$inv_v %*% svd_inv$inv_d

# calculate and print the recommendations
output_recommendation = t %*% diag(svd_mod$d) %*% t(svd_mod$v)
names(output_recommendation) = names(show_means)
write(names(sort(output_recommendation, decreasing=TRUE)), stdout())