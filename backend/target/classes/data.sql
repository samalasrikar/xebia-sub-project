-- Clear existing data
DELETE FROM submission_files;
DELETE FROM submission;
DELETE FROM assignment_attachments;
DELETE FROM assignment;
DELETE FROM batch;
DELETE FROM course;

-- Seed Courses
INSERT INTO course (id, title) VALUES ('c1', 'Cloud Native Engineering');
INSERT INTO course (id, title) VALUES ('c2', 'Java Full Stack');

-- Seed Batches
INSERT INTO batch (id, title) VALUES ('b1', 'B-2024-Q1');
INSERT INTO batch (id, title) VALUES ('b2', 'Batch 2023-A');

-- Seed Assignments
INSERT INTO assignment (id, title, course, course_id, batch, batch_id, scope, due_date, status, max_marks, weightage, attempts_allowed, description, instructions, submission_formats)
VALUES ('a1', 'Microservices Architecture Lab', 'Cloud Native Engineering', 'c1', 'B-2024-Q1', 'b1', 'Entire Course', 'Oct 24, 2026', 'Active', 100, '25% of Final Grade', '1 / 2', 'In this assignment, you will architect and implement a microservices architecture. Focus on load balancing and message queues.', '1. Expose necessary services.\n2. Maintain consistent state synchronization.\n3. Verify your docker-compose environment compiles.', 'file');

INSERT INTO assignment (id, title, course, course_id, batch, batch_id, scope, due_date, status, max_marks, weightage, attempts_allowed, description, instructions, submission_formats)
VALUES ('a5', 'Advanced Algorithm Analysis', 'Cloud Native Engineering', 'c1', 'Batch 2023-A', 'b2', 'Entire Course', 'Yesterday, 11:59 PM', 'Overdue', 100, '30% of Final Grade', '1 / 1', 'Analyze the time and space complexity of sorting algorithms.', 'Provide mathematical proofs for your big-O bounds.', 'file');

INSERT INTO assignment (id, title, course, course_id, batch, batch_id, scope, due_date, status, max_marks, weightage, attempts_allowed, description, instructions, submission_formats)
VALUES ('a9', 'Database Normalization Quiz', 'Java Full Stack', 'c2', 'Batch 2023-A', 'b2', 'Entire Course', 'Oct 15, 2026', 'Reviewed', 50, '15% of Final Grade', '1 / 1', 'Normalize a given denormalized schema from 1NF to 3NF.', 'Explain decomposition steps.', 'file');

-- Seed Assignment Attachments
INSERT INTO assignment_attachments (assignment_id, name, size, type)
VALUES ('a1', 'Architecture_Diagram.pdf', '2.4 MB', 'pdf');

-- Seed Submissions
INSERT INTO submission (id, assignment_id, assignment_title, student_id, student_name, student_avatar, batch, submitted_at, submitted_date_raw, status, attempt, student_note, score, feedback, private_notes, evaluator, evaluated_date)
VALUES ('sub1', 'a1', 'Microservices Architecture Lab', 's1', 'Alex Mercer', '', 'B-2024-Q1', '2 hours ago', '2026-07-06T12:08:18Z', 'Submitted', 1, 'Scalability aspects are detailed in the proposal PDF.', NULL, '', '', '', '');

INSERT INTO submission (id, assignment_id, assignment_title, student_id, student_name, student_avatar, batch, submitted_at, submitted_date_raw, status, attempt, student_note, score, feedback, private_notes, evaluator, evaluated_date)
VALUES ('sub9', 'a9', 'Database Normalization Quiz', 's4', 'Jane Doe', '', 'Batch 2023-A', 'Oct 24, 2026, 14:30 EST', '2026-10-24T14:30:00Z', 'Graded', 1, 'Normalized schema up to BCNF.', 85, 'Overall, this is a solid submission that meets the core requirements of the prompt. The schema decompositions are accurate.\n\nStrengths:\n- Clean normal forms.\n- Solid documentation.\n\nAreas for Improvement:\n- Consider dependencies key closures detail.', 'Well done.', 'Dr. Sarah Jenkins', 'Oct 26, 2026');

-- Seed Submission Files
INSERT INTO submission_files (submission_id, name, size, type)
VALUES ('sub1', 'architecture_proposal.pdf', '2.4 MB', 'pdf');

INSERT INTO submission_files (submission_id, name, size, type)
VALUES ('sub9', 'normalization_answers.pdf', '2.4 MB', 'pdf');
