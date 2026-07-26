const paginate = (req, res, next) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
  const offset = (page - 1) * limit;

  req.pagination = { page, limit, offset };

  next();
};

const paginateResponse = (data, total, req) => {
  const { page, limit } = req.pagination;
  const total_pages = Math.ceil(total / limit);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      total_pages,
      has_next: page < total_pages,
      has_prev: page > 1,
    },
  };
};

module.exports = { paginate, paginateResponse };
