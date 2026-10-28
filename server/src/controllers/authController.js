import { User } from '../models/User.js';
import { CandidateProfile } from '../models/CandidateProfile.js';
import { ReferrerProfile } from '../models/ReferrerProfile.js';
import { Notification } from '../models/Notification.js';
import { generateTokens, verifyRefreshToken } from '../utils/tokenUtils.js';

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role = 'CANDIDATE', companyName, jobTitle } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, email, and password.'
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email address already exists.'
      });
    }

    const validRoles = ['CANDIDATE', 'REFERRER', 'RECRUITER', 'ADMIN'];
    const assignedRole = validRoles.includes(role.toUpperCase()) ? role.toUpperCase() : 'CANDIDATE';

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: assignedRole
    });

    // Automatically scaffold appropriate profile based on role
    if (assignedRole === 'CANDIDATE') {
      await CandidateProfile.create({
        userId: user._id,
        headline: 'Full Stack Engineer | React & Node.js',
        bio: 'Passionate developer building scalable web applications.',
        location: 'Bengaluru, India',
        skills: ['react', 'node.js', 'mongodb', 'javascript', 'express', 'git'],
        experienceYears: 2
      });
    } else if (assignedRole === 'REFERRER') {
      await ReferrerProfile.create({
        userId: user._id,
        companyName: companyName || 'Google',
        role: jobTitle || 'Senior Software Engineer',
        department: 'Engineering'
      });
    }

    // Welcome Notification
    await Notification.create({
      recipientId: user._id,
      type: 'WELCOME',
      title: `Welcome to ReferHire, ${user.name.split(' ')[0]}!`,
      message: `Your account has been created with role: ${assignedRole}. Explore opportunities and connections.`
    });

    const { accessToken, refreshToken } = generateTokens(user);

    // Save refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    user.refreshTokens.push({ token: refreshToken, expiresAt });
    await user.save();

    // Set cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar
        },
        accessToken
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const { accessToken, refreshToken } = generateTokens(user);

    // Store refresh token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    user.refreshTokens.push({ token: refreshToken, expiresAt });
    user.lastLogin = new Date();
    await user.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      message: 'Logged in successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar
        },
        accessToken
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Refresh Access Token
// @route   POST /api/auth/refresh
// @access  Public
export const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No refresh token provided.'
      });
    }

    const decoded = verifyRefreshToken(token);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token.'
      });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User belonging to refresh token not found.'
      });
    }

    const tokenExists = user.refreshTokens.some(t => t.token === token);
    if (!tokenExists) {
      // Possible token reuse detected
      user.refreshTokens = [];
      await user.save();
      return res.status(403).json({
        success: false,
        message: 'Refresh token reuse detected. Please login again.'
      });
    }

    // Rotate refresh token
    user.refreshTokens = user.refreshTokens.filter(t => t.token !== token);
    const tokens = generateTokens(user);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    user.refreshTokens.push({ token: tokens.refreshToken, expiresAt });
    await user.save();

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      data: {
        accessToken: tokens.accessToken
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout
// @route   POST /api/auth/logout
// @access  Authenticated
export const logout = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;
    if (token && req.user) {
      req.user.refreshTokens = req.user.refreshTokens.filter(t => t.token !== token);
      await req.user.save();
    }

    res.clearCookie('refreshToken');
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Current Logged in User with profile details
// @route   GET /api/auth/me
// @access  Authenticated
export const getMe = async (req, res, next) => {
  try {
    let profile = null;

    if (req.user.role === 'CANDIDATE') {
      profile = await CandidateProfile.findOne({ userId: req.user._id });
    } else if (req.user.role === 'REFERRER') {
      profile = await ReferrerProfile.findOne({ userId: req.user._id });
    }

    res.json({
      success: true,
      data: {
        user: req.user,
        profile
      }
    });
  } catch (error) {
    next(error);
  }
};
