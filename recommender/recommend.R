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
write(current_dir, stderr())

