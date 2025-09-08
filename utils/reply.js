// ? *************************************************** Failed Response *************************************************** /
exports.failed = (res, message, status = 500) => {
  return res.status(status).json({ status: false, message });
};

// ? *************************************************** Success Response *************************************************** /
exports.success = (res, message, data = null, extra = []) => {
  let success = { status: true, message: message };

  if (data !== null) {
    success = { ...success, data: data };
  }

  if (extra.length > 0) {
    for (const key in extra) {
      success = { ...success, ...extra[key] };
    }
  }

  return res.status(200).json(success);
};
