const Booking = require('../models/Booking');
const Lead = require('../models/Lead');
const Project = require('../models/Project');
const Notification = require('../models/Notification');
const { sendBookingConfirmation, sendAdminLeadNotification } = require('../utils/email');
const { formatWhatsAppMessage, paginate } = require('../utils/helpers');

exports.createBooking = async (req, res) => {
  try {
    const { projectId, fullName, email, mobile, investmentAmount, message } = req.body;
    if (!projectId || !fullName || !email || !mobile || !investmentAmount)
      return res.status(400).json({ success: false, message: 'All required fields must be filled.' });

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });
    if (project.slots.available <= 0) return res.status(400).json({ success: false, message: 'No slots available.' });

    const booking = await Booking.create({
      project: projectId, fullName, email, mobile, investmentAmount, message,
      user: req.user?._id,
    });

    await Project.findByIdAndUpdate(projectId, { $inc: { 'slots.booked': 1, 'slots.available': -1 } });

    await Lead.create({
      project: projectId, fullName, email, mobile, budget: investmentAmount, message,
      user: req.user?._id, source: 'Website',
    });

    if (req.user) {
      await Notification.create({
        user: req.user._id,
        title: 'Booking Confirmed',
        message: `Your booking for ${project.title} has been received.`,
        type: 'booking',
        link: `/dashboard/bookings/${booking._id}`,
      });
    }

    await sendBookingConfirmation({ to: email, name: fullName, projectName: project.title, bookingId: booking.bookingId, amount: investmentAmount });
    await sendAdminLeadNotification({ projectName: project.title, leadName: fullName, leadEmail: email, leadMobile: mobile });

    const whatsappMsg = formatWhatsAppMessage({ projectName: project.title, name: fullName, phone: mobile });
    const whatsappUrl = `https://wa.me/${process.env.WHATSAPP_NUMBER}?text=${whatsappMsg}`;

    res.status(201).json({ success: true, message: 'Booking successful!', booking, whatsappUrl });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('project', 'title slug coverImage location.city pricing.startingPrice')
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (search) filter.$or = [{ fullName: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }, { bookingId: new RegExp(search, 'i') }];

    const { skip, limit: lim } = paginate(page, limit);
    const [bookings, total] = await Promise.all([
      Booking.find(filter).populate('project', 'title').sort({ createdAt: -1 }).skip(skip).limit(lim),
      Booking.countDocuments(filter),
    ]);
    res.json({ success: true, bookings, total, page: parseInt(page), pages: Math.ceil(total / lim) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
