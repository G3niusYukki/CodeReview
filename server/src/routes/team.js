const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { Team, TeamMember } = require('../models/Team');
const User = require('../models/User');

// 创建团队
router.post('/', auth, async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name || name.trim().length < 2) {
      return res.status(400).json({ error: 'Team name must be at least 2 characters' });
    }

    // 检查用户是否已有团队
    const existingTeam = await Team.findOne({ where: { ownerId: req.user.id } });
    if (existingTeam) {
      return res.status(400).json({ error: 'You already own a team' });
    }

    const team = await Team.create({
      name: name.trim(),
      ownerId: req.user.id
    });

    // 创建者自动成为 owner
    await TeamMember.create({
      teamId: team.id,
      userId: req.user.id,
      role: 'owner'
    });

    res.status(201).json({
      message: 'Team created successfully',
      team: {
        id: team.id,
        name: team.name,
        ownerId: team.ownerId,
        reviewsLimit: team.reviewsLimit,
        reviewsUsed: team.reviewsUsed,
        createdAt: team.createdAt
      }
    });
  } catch (error) {
    console.error('Create team error:', error);
    res.status(500).json({ error: 'Failed to create team' });
  }
});

// 获取用户的团队列表
router.get('/', auth, async (req, res) => {
  try {
    const memberships = await TeamMember.findAll({
      where: { userId: req.user.id },
      include: [{
        model: Team,
        where: { isActive: true }
      }]
    });

    const teams = memberships.map(m => ({
      id: m.Team.id,
      name: m.Team.name,
      role: m.role,
      reviewsLimit: m.Team.reviewsLimit,
      reviewsUsed: m.Team.reviewsUsed,
      createdAt: m.Team.createdAt
    }));

    res.json({ teams });
  } catch (error) {
    console.error('Get teams error:', error);
    res.status(500).json({ error: 'Failed to get teams' });
  }
});

// 获取团队详情
router.get('/:id', auth, async (req, res) => {
  try {
    const membership = await TeamMember.findOne({
      where: {
        teamId: req.params.id,
        userId: req.user.id
      }
    });

    if (!membership) {
      return res.status(403).json({ error: 'You are not a member of this team' });
    }

    const team = await Team.findByPk(req.params.id);
    const members = await TeamMember.findAll({
      where: { teamId: team.id },
      include: [{
        model: User,
        attributes: ['id', 'username', 'email', 'avatar']
      }]
    });

    res.json({
      team: {
        id: team.id,
        name: team.name,
        reviewsLimit: team.reviewsLimit,
        reviewsUsed: team.reviewsUsed,
        myRole: membership.role
      },
      members: members.map(m => ({
        id: m.User.id,
        username: m.User.username,
        email: m.User.email,
        avatar: m.User.avatar,
        role: m.role,
        joinedAt: m.createdAt
      }))
    });
  } catch (error) {
    console.error('Get team error:', error);
    res.status(500).json({ error: 'Failed to get team details' });
  }
});

// 邀请成员
router.post('/:id/members', auth, async (req, res) => {
  try {
    const { email, role = 'member' } = req.body;
    
    // 检查权限
    const membership = await TeamMember.findOne({
      where: {
        teamId: req.params.id,
        userId: req.user.id,
        role: ['owner', 'admin']
      }
    });

    if (!membership) {
      return res.status(403).json({ error: 'Only team owners and admins can invite members' });
    }

    // 查找用户
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // 检查是否已经是成员
    const existingMember = await TeamMember.findOne({
      where: {
        teamId: req.params.id,
        userId: user.id
      }
    });

    if (existingMember) {
      return res.status(400).json({ error: 'User is already a team member' });
    }

    const newMember = await TeamMember.create({
      teamId: req.params.id,
      userId: user.id,
      role
    });

    res.status(201).json({
      message: 'Member invited successfully',
      member: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        role: newMember.role
      }
    });
  } catch (error) {
    console.error('Invite member error:', error);
    res.status(500).json({ error: 'Failed to invite member' });
  }
});

// 移除成员
router.delete('/:id/members/:userId', auth, async (req, res) => {
  try {
    // 检查权限
    const membership = await TeamMember.findOne({
      where: {
        teamId: req.params.id,
        userId: req.user.id,
        role: ['owner', 'admin']
      }
    });

    if (!membership) {
      return res.status(403).json({ error: 'Only team owners and admins can remove members' });
    }

    // 不能移除 owner
    const targetMember = await TeamMember.findOne({
      where: {
        teamId: req.params.id,
        userId: req.params.userId
      }
    });

    if (targetMember?.role === 'owner') {
      return res.status(403).json({ error: 'Cannot remove team owner' });
    }

    await TeamMember.destroy({
      where: {
        teamId: req.params.id,
        userId: req.params.userId
      }
    });

    res.json({ message: 'Member removed successfully' });
  } catch (error) {
    console.error('Remove member error:', error);
    res.status(500).json({ error: 'Failed to remove member' });
  }
});

module.exports = router;
